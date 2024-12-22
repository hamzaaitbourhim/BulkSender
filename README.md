# BulkSender Add-On for Google Sheets

**BulkSender** is a Google Sheets add-on for sending personalized emails in bulk using Gmail drafts.

![BulkSender_logo_2_2_optimized](https://github.com/user-attachments/assets/e1711ef5-5573-4eed-b232-ed3bd58e2737)

## Features
- Select Gmail drafts and sender name.
- Schedule email sends for a future date and time.
- Automatically tracks email statuses (Sent/Bounced).

## Installation & Usage
0. Navigate to Gmail, create the email you want to send and close it as a draft.

![draft](https://github.com/user-attachments/assets/39c20f4f-6831-4235-8c75-0cd7d4dcd9d2)

1. Open Google Sheets and create a new sheet.
2. Navigate to `Extensions > Apps Script` and paste the script files (located in the src folder of this repository) and save.
   
![files](https://github.com/user-attachments/assets/a6ff48c1-44d9-4e76-b02c-1e67789beca1)

3. Add email addresses to Column A in the Google Sheet staring from cell A2.

![emails](https://github.com/user-attachments/assets/29bce307-9aa1-4697-bc4c-71adca466a23)

4. Open `BulkSender` from the custom menu (if it doesn't appear refresh the page).

![ext](https://github.com/user-attachments/assets/651853ff-5297-4187-a594-3e1085696465)

5. Select an email draft and specify the sender name.

![bulksend](https://github.com/user-attachments/assets/25b00f54-0535-4d3f-b573-fc11dc3e1674)

6. Send immediately or schedule for a future date.
7. Automatically tracks email statuses (Sent/Bounced).

![image](https://github.com/user-attachments/assets/8c7bd2e0-d8c5-4248-835d-9b95503fd4a9)

## Permissions
This add-on requires:
- Access to Gmail drafts.
- Access to the active Google Sheet.

## Contributing
Contributions are welcome! Feel free to fork this repository and submit pull requests.
