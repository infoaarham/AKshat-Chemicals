# ADMIN DASHBOARD — quick guide

URL: yoursite.com/admin.html · Passcode = ADMIN_KEY in assets/config.js.

MODES
- LIVE (green banner): connected to the Google Sheet (GOOGLE-SETUP.md
  done). Everything below writes straight into the Sheet.
- LOCAL (amber banner): backend not connected yet; shows this
  browser's log only.

FEATURES
- KPI cards: total, today, pending, quotation sent, converted, rate.
- Search across every field; status filter.
- Inline editing → saves instantly to the Sheet: Status, Assigned To,
  Remarks, Quotation Sent, Converted, Priority (Normal/High/Urgent),
  Customer Type (New/Repeat/Key Account).
- ↻ repeat ×N badge = same phone/email enquired before.
  Click any phone number to see that customer's full history.
- ⏰ follow-up due badge when Follow-up Date (set in the Sheet) has
  arrived.
- Export CSV, Export Excel, Print, Dark mode.
- 📄 icon opens the enquiry PDF stored in Google Drive
  (Enquiries/<Year>/<Month>/).

NOTE: after updating Code.gs (this version adds Priority & Customer
Type columns), re-deploy the Apps Script: Deploy → Manage deployments
→ edit → New version.
