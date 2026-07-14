/************************************************************
 * AKSHAT CHEMICALS — Google Workspace Enquiry Backend
 * Paste this whole file into Apps Script (see GOOGLE-SETUP.md).
 * It turns one Google Sheet into your enquiry database, creates
 * organised Drive folders with an enquiry PDF, and sends three
 * automatic emails on every enquiry.
 ************************************************************/

/**** EDIT THESE THREE LINES ****/
const SECRET_KEY   = "akshat2007";                       // must match ADMIN_KEY in assets/config.js
const SALES_EMAIL  = "akshatchemicals@gmail.com";        // detailed enquiry goes here
const PROMO_EMAIL  = "akshatchemicals@gmail.com";        // instant promoter alert (can be another address)
/********************************/

const SHEET_NAME = "Enquiries";
const HEADERS = ["Enquiry ID","Date","Time","Name","Company","Phone","Email","Product","Packing",
                 "Quantity","Price Shown","Message","Source Page","Status","Assigned To","Remarks",
                 "Follow-up Date","Quotation Sent","Converted","PDF Link","Priority","Customer Type"];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.getRange(1,1,1,HEADERS.length).setFontWeight("bold").setBackground("#081C3A").setFontColor("#FFFFFF");
    sh.setFrozenRows(1);
  }
  return sh;
}

function driveFolder_() {
  const now = new Date();
  const y = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy");
  const m = Utilities.formatDate(now, Session.getScriptTimeZone(), "MMMM");
  const root = getOrCreate_(DriveApp.getRootFolder(), "Enquiries");
  return getOrCreate_(getOrCreate_(root, y), m);
}
function getOrCreate_(parent, name) {
  const it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}

function newId_(sh) {
  const n = sh.getLastRow(); // header = 1
  return "AC-" + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMM") + "-" + String(n).padStart(4, "0");
}

/* ---------------- POST: new enquiry / admin updates ---------------- */
function doPost(e) {
  let body = {};
  try { body = JSON.parse(e.postData.contents || "{}"); } catch (_) {}
  const action = body.action || "enquiry";

  if (action === "enquiry")  return json_(saveEnquiry_(body.data || {}));
  if (body.key !== SECRET_KEY) return json_({ ok: false, error: "unauthorised" });
  if (action === "update")   return json_(updateRow_(body.id, body.fields || {}));
  if (action === "delete")   return json_(deleteRow_(body.id));
  return json_({ ok: false, error: "unknown action" });
}

/* ---------------- GET: admin panel reads the database ---------------- */
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.key !== SECRET_KEY) return json_({ ok: false, error: "unauthorised" });
  const sh = sheet_();
  const last = sh.getLastRow();
  const rows = last > 1 ? sh.getRange(2, 1, last - 1, HEADERS.length).getDisplayValues() : [];
  return json_({ ok: true, headers: HEADERS, rows: rows });
}

function saveEnquiry_(d) {
  const sh = sheet_();
  const id = newId_(sh);
  const now = new Date();
  const date = Utilities.formatDate(now, Session.getScriptTimeZone(), "dd-MMM-yyyy");
  const time = Utilities.formatDate(now, Session.getScriptTimeZone(), "HH:mm");

  // Drive: enquiry PDF in Enquiries/<Year>/<Month>/
  let pdfUrl = "";
  try {
    const folder = driveFolder_();
    const html = enquiryHtml_(id, date, time, d);
    const pdf = Utilities.newBlob(html, "text/html", id + ".html").getAs("application/pdf").setName(id + " — " + (d.name || "Enquiry") + ".pdf");
    pdfUrl = folder.createFile(pdf).getUrl();
  } catch (err) { pdfUrl = "PDF failed: " + err; }

  sh.appendRow([id, date, time, d.name || "", d.company || "", "'" + (d.phone || ""), d.email || "",
                d.product || "General enquiry", d.packing || "", d.quantity || "", d.priceShown || "",
                d.message || "", d.page || "", "New", "", "", "", "No", "No", pdfUrl, "Normal", "New"]);

  // Emails: customer acknowledgement + sales detail + promoter alert
  try {
    if (d.email) MailApp.sendEmail({
      to: d.email,
      subject: "Enquiry received — Akshat Chemicals (" + id + ")",
      htmlBody: ackHtml_(id, d),
      name: "Akshat Chemicals"
    });
    MailApp.sendEmail({
      to: SALES_EMAIL,
      subject: "New Enquiry " + id + " — " + (d.product || "General") + " — " + (d.name || ""),
      htmlBody: enquiryHtml_(id, date, time, d) + (pdfUrl ? "<p><a href='" + pdfUrl + "'>Open enquiry PDF in Drive</a></p>" : ""),
      name: "Akshat Website"
    });
    if (PROMO_EMAIL && PROMO_EMAIL !== SALES_EMAIL) MailApp.sendEmail({
      to: PROMO_EMAIL,
      subject: "⚡ " + id + ": " + (d.product || "General") + " — " + (d.quantity || ""),
      htmlBody: "<p><b>" + (d.name || "") + "</b> (" + (d.company || "—") + ") · " + (d.phone || "") +
                "<br>" + (d.product || "") + " · " + (d.packing || "") + " · " + (d.quantity || "") + "</p>",
      name: "Akshat Website"
    });
  } catch (err) { /* email quota exceeded — data is still in the Sheet */ }

  return { ok: true, id: id };
}

function updateRow_(id, fields) {
  const sh = sheet_();
  const ids = sh.getRange(2, 1, Math.max(sh.getLastRow() - 1, 1), 1).getValues().flat();
  const r = ids.indexOf(id);
  if (r < 0) return { ok: false, error: "id not found" };
  const row = r + 2;
  const editable = { "Status":14, "Assigned To":15, "Remarks":16, "Follow-up Date":17, "Quotation Sent":18, "Converted":19, "Priority":21, "Customer Type":22 };
  Object.keys(fields).forEach(k => { if (editable[k]) sh.getRange(row, editable[k]).setValue(fields[k]); });
  return { ok: true };
}

function deleteRow_(id) {
  const sh = sheet_();
  const ids = sh.getRange(2, 1, Math.max(sh.getLastRow() - 1, 1), 1).getValues().flat();
  const r = ids.indexOf(id);
  if (r < 0) return { ok: false, error: "id not found" };
  sh.deleteRow(r + 2);
  return { ok: true };
}

/* ---------------- templates ---------------- */
function enquiryHtml_(id, date, time, d) {
  const row = (k, v) => "<tr><td style='padding:6px 12px;border:1px solid #D8DFEA;font-weight:bold;background:#F2F5F9'>" + k +
                        "</td><td style='padding:6px 12px;border:1px solid #D8DFEA'>" + (v || "—") + "</td></tr>";
  return "<div style='font-family:Arial,sans-serif'>" +
    "<h2 style='color:#081C3A'>Akshat Chemicals — Enquiry " + id + "</h2>" +
    "<table style='border-collapse:collapse;font-size:13px'>" +
    row("Date", date + " " + time) + row("Name", d.name) + row("Company", d.company) +
    row("Phone", d.phone) + row("Email", d.email) + row("Product", d.product) +
    row("Packing", d.packing) + row("Quantity", d.quantity) + row("Price shown", d.priceShown) +
    row("Message", d.message) + row("Source page", d.page) +
    "</table></div>";
}
function ackHtml_(id, d) {
  return "<div style='font-family:Arial,sans-serif;max-width:560px'>" +
    "<h2 style='color:#081C3A'>Thank you — your enquiry is received</h2>" +
    "<p>Dear " + (d.name || "Sir/Madam") + ",</p>" +
    "<p>We have received your enquiry <b>" + id + "</b> for <b>" + (d.product || "our products") + "</b>" +
    (d.packing ? " (" + d.packing + ")" : "") + (d.quantity ? ", quantity " + d.quantity : "") + ".</p>" +
    "<p>Our sales team will revert with a firm quotation within <b>24 working hours</b>. For anything urgent, " +
    "call <b>022-49730799</b> or WhatsApp <b>+91 92235 02988</b>.</p>" +
    "<p style='color:#64748B;font-size:12px'>Akshat Chemicals · A-501 Citi Point Premises, J B Nagar, Andheri (E), Mumbai 400059 · akshatchemicals@gmail.com</p></div>";
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
