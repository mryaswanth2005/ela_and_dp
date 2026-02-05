// Google Apps Script Code
// Deploy this as a Web App with "Execute as: Me" and "Who has access: Anyone"

// Replace with your Google Sheet ID
const SHEET_ID = '1cH2waaRC2kiyqzyNCFkwGpfFVdN7AdhQ4neg1H2M5Wk';
const SHEET_NAME = 'Registrations';

// Main function to handle GET requests (fetch registration count)
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

    // Get all data rows (excluding header)
    const data = sheet.getDataRange().getValues();
    const count = data.length - 1; // Subtract 1 for header row

    const result = {
      success: true,
      count: count
    };

    // Handle JSONP callback if provided
    if (e.parameter.callback) {
      return ContentService
        .createTextOutput(e.parameter.callback + '(' + JSON.stringify(result) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    const result = {
      success: false,
      error: 'Failed to fetch registration count'
    };

    if (e.parameter.callback) {
      return ContentService
        .createTextOutput(e.parameter.callback + '(' + JSON.stringify(result) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Main function to handle POST requests (new registration)
function doPost(e) {
  try {
    // Handle both JSON and form data
    let data;
    if (e.postData && e.postData.type === 'application/json') {
      data = JSON.parse(e.postData.contents);
    } else {
      // Handle form-encoded data from HTML form submission
      const params = e.parameter;
      data = {
        name: params.name,
        class: params.class,
        email: params.email,
        mobile: params.mobile
      };
    }

    const { name, class: classSection, email, mobile } = data;

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

    // Get all existing data
    const existingData = sheet.getDataRange().getValues();

    // Check for duplicates (skip header row)
    for (let i = 1; i < existingData.length; i++) {
      const row = existingData[i];
      if (row[3] === email || row[4] === mobile) { // Email is column 3, Mobile is column 4
        // Return HTML that calls parent function
        return ContentService
          .createTextOutput(`
            <html>
              <body>
                <script>
                  window.parent.postMessage({
                    type: 'registration_response',
                    success: false,
                    error: 'This email or mobile number is already registered.'
                  }, '*');
                </script>
              </body>
            </html>
          `)
          .setMimeType(ContentService.MimeType.HTML);
      }
    }

    // Add new registration
    const timestamp = new Date();
    const newRow = [timestamp, name, classSection, email, mobile];
    sheet.appendRow(newRow);

    // Return HTML that calls parent function
    return ContentService
      .createTextOutput(`
        <html>
          <body>
            <script>
              window.parent.postMessage({
                type: 'registration_response',
                success: true,
                message: 'Registration successful!'
              }, '*');
            </script>
          </body>
        </html>
      `)
      .setMimeType(ContentService.MimeType.HTML);

  } catch (error) {
    // Return HTML that calls parent function
    return ContentService
      .createTextOutput(`
        <html>
          <body>
            <script>
              window.parent.postMessage({
                type: 'registration_response',
                success: false,
                error: 'Registration failed. Please try again.'
              }, '*');
            </script>
          </body>
        </html>
      `)
      .setMimeType(ContentService.MimeType.HTML);
  }
}