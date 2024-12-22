/**
 * Adds a custom menu to the Google Sheets interface for launching the BulkSender add-on.
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("BulkSender")
    .addItem("Start bulk sending", "showDraftSelectionDialog")
    .addToUi();

  // set up headers in the spreadsheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange("A1").setValue("Email Address");
  sheet.getRange("B1").setValue("Email Status");
}

/**
 * Displays the draft selection dialog.
 * @param {string} draftSubject - The email draft subject preselected (default: "").
 * @param {string} senderName - The sender name prefilled in the input field (default: "").
 */
function showDraftSelectionDialog(draftSubject = "", senderName = "") {
  var drafts = getAllDraftSubjects(); // Fetch all draft subjects
  var html = HtmlService.createTemplateFromFile("DraftSelectionDialog");
  html.drafts = drafts;
  html.draftSubject = draftSubject;
  html.senderName = senderName;

  SpreadsheetApp.getUi()
    .showModalDialog(html.evaluate().setWidth(450).setHeight(220), "Start Bulk Sending");
}

/**
 * Fetches all Gmail draft subjects.
 * @returns {string[]} An array of email draft subjects.
 */
function getAllDraftSubjects() {
  return GmailApp.getDrafts().map((draft) => draft.getMessage().getSubject());
}

/**
 * Displays the scheduling dialog for selecting a date and time to send emails.
 * @param {string} draftSubject - The selected email draft subject.
 * @param {string} senderName - The specified sender name.
 */
function showScheduleDialog(draftSubject, senderName) {
  var html = HtmlService.createTemplateFromFile("ScheduleDialog");
  html.draftSubject = draftSubject;
  html.senderName = senderName;

  SpreadsheetApp.getUi()
    .showModalDialog(html.evaluate().setWidth(450).setHeight(190), "Schedule Emails");
}

/**
 * Creates a time-based trigger to send emails at the specified date and time.
 * @param {string} draftSubject - The selected email draft subject.
 * @param {string} senderName - The specified sender name.
 * @param {string} deliveryDate - The delivery date in "YYYY-MM-DD" format.
 * @param {string} deliveryTime - The delivery time in "HH:MM" 24-hour format.
 */
function scheduleMerge(draftSubject, senderName, deliveryDate, deliveryTime) {
  var [year, month, day] = deliveryDate.split("-").map(Number);
  var [hour, minute] = deliveryTime.split(":").map(Number);
  var runDate = new Date(year, month - 1, day, hour, minute); // JS months are zero-based

  // Save draft and sender details for later use
  PropertiesService.getScriptProperties().setProperties({
    draftSubject,
    senderName,
  });

  // Create the trigger to run at the specified date/time
  ScriptApp.newTrigger("scheduledSend")
    .timeBased()
    .at(runDate)
    .create();

  // Notify the user of the scheduled time
  SpreadsheetApp.getUi().alert(
    `Your emails have been scheduled for:\n${runDate.toString()}`
  );
}

/**
 * Triggered at the scheduled time. Retrieves stored information and sends emails.
 */
function scheduledSend() {
  var props = PropertiesService.getScriptProperties();
  var draftSubject = props.getProperty("draftSubject");
  var senderName = props.getProperty("senderName");

  // Clear stored properties after use
  props.deleteAllProperties();

  // Send the emails
  sendEmailsFromSelectedDraft(draftSubject, senderName);
}

/**
 * Sends emails for the specified draft and sender name, including attachments.
 * @param {string} draftSubject - The selected email draft subject.
 * @param {string} senderName - The specified sender name.
 */
function sendEmailsFromSelectedDraft(draftSubject, senderName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange("A2:B" + sheet.getLastRow()).getValues();

  var draft = getDraftBySubject(draftSubject);
  if (!draft) {
    SpreadsheetApp.getUi().alert(`No draft found with subject: ${draftSubject}`);
    return;
  }

  var message = draft.getMessage();
  var subject = message.getSubject();
  var body = message.getBody();
  var attachments = message.getAttachments();

  data.forEach(([email, status], i) => {
    if (!email || status) return; // Skip if no email or already processed
    try {
      MailApp.sendEmail({
        to: email,
        subject: subject,
        htmlBody: body,
        name: senderName,
        attachments: attachments,
      });
      sheet.getRange(i + 2, 2).setValue("SENT").setBackground("green");
    } catch (e) {
      sheet.getRange(i + 2, 2).setValue("BOUNCED").setBackground("red");
    }
  });
}

/**
 * Finds a Gmail draft by its exact subject.
 * @param {string} subject - The subject of the email draft.
 * @returns {GmailDraft} The Gmail draft object matching the subject, or null if not found.
 */
function getDraftBySubject(subject) {
  return GmailApp.getDrafts().find((draft) => draft.getMessage().getSubject() === subject) || null;
}
