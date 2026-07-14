GOOGLE WORKSPACE BACKEND — SETUP (10 MINUTES, ONE TIME)
=========================================================
This turns a free Google Sheet into your enquiry database with
automatic Drive folders, enquiry PDFs and three automatic emails —
no server, no hosting cost, no coding.

STEP 1 — CREATE THE SHEET
  1. Go to sheets.google.com (logged in as akshatchemicals@gmail.com).
  2. Create a blank spreadsheet. Name it: Akshat Enquiries.

STEP 2 — ADD THE SCRIPT
  1. In the sheet: Extensions -> Apps Script.
  2. Delete any code shown. Open google-apps-script/Code.gs from this
     website folder, copy ALL of it, paste it in.
  3. At the top of the code, check the three EDIT lines:
       SECRET_KEY  = "akshat2007"   (change if you change the admin passcode)
       SALES_EMAIL = your sales inbox
       PROMO_EMAIL = promoter's email for instant alerts (can be same)
  4. Click the save (disk) icon.

STEP 3 — DEPLOY
  1. Click Deploy -> New deployment.
  2. Click the gear icon -> select "Web app".
  3. Description: Akshat enquiries
     Execute as: Me
     Who has access: Anyone          <-- important
  4. Click Deploy. Authorise with your Google account when asked
     (Advanced -> Go to project -> Allow).
  5. COPY the Web app URL (ends in /exec).

STEP 4 — CONNECT THE WEBSITE
  1. Open assets/config.js in your website folder.
  2. Paste the URL:   GAS_URL: "https://script.google.com/macros/s/…/exec"
  3. Make sure ADMIN_KEY matches SECRET_KEY from Step 2.
  4. Re-upload assets/config.js to your hosting. Done.

WHAT HAPPENS ON EVERY ENQUIRY NOW
  - A row is added to the Google Sheet with: Enquiry ID, date, time,
    name, company, phone, email, product, packing, quantity, price
    shown, message, source page, status, assigned-to, remarks,
    follow-up date, quotation sent, converted, PDF link.
  - A folder Enquiries/<Year>/<Month>/ is created in your Google
    Drive and a formatted PDF of the enquiry is saved there.
  - The CUSTOMER gets a professional acknowledgement email.
  - The SALES inbox gets the full enquiry with the Drive PDF link.
  - The PROMOTER gets a one-line instant alert.
  - The website Admin Panel (admin.html) reads and edits this Sheet
    live: change Status/Assigned/Remarks in either place and the
    other shows it.

FALLBACK
  Until GAS_URL is filled in, the site quietly falls back to the old
  FormSubmit email + local log, so no enquiry is ever lost during setup.

LIMITS (Google free tier)
  MailApp: ~100 recipient-emails/day on a Gmail account — roughly 30
  enquiries/day with all three emails. Plenty for now; a Google
  Workspace account raises it to 1,500/day.
