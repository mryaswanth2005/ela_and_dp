# Poster Reveal Website Setup Instructions

## Overview
This project creates a registration-based poster reveal website where users register via a form, and the poster is revealed only after 50 registrations are completed. Data is stored in Google Sheets via Google Apps Script.

## Project Files
- `index.html` - Main HTML structure
- `style.css` - Modern CSS styling with animations
- `script.js` - JavaScript for form handling and poster logic
- `apps-script.js` - Google Apps Script code for backend
- `poster.jpg` - Placeholder for your poster image (replace with your actual poster)

## Step-by-Step Setup

### 1. Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name the sheet tab "Registrations" (important - the code expects this exact name)
4. Set up the following column headers in row 1:
   - A1: Timestamp
   - B1: Name
   - C1: Class
   - D1: Email
   - E1: Mobile Number
5. Copy the **Spreadsheet ID** from the URL (the long string between `/d/` and `/edit`)

### 2. Set Up Google Apps Script
1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any default code in the script editor
3. Copy the entire content from `apps-script.js` and paste it
4. Replace `'YOUR_GOOGLE_SHEET_ID_HERE'` with your actual Spreadsheet ID
5. Save the script (Ctrl+S or File > Save)

### 3. Deploy as Web App
1. Click the **Deploy** button (blue button)
2. Select **New deployment**
3. Choose type: **Web app**
4. Set the following options:
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. **Copy the Web App URL** - you'll need this for the frontend

### 4. Update Frontend Code
1. Open `script.js`
2. Replace `'YOUR_APPS_SCRIPT_URL_HERE'` with your Web App URL
3. Save the file

### 5. Add Your Poster Image
1. Create a placeholder image (600x800px recommended) or use any image editor
2. Save it as `poster.jpeg` in the same directory as the HTML file
3. Replace this placeholder with your actual event poster

### 6. Test the Website
1. Open `index.html` in a web browser
2. Test the registration form
3. Check that the counter updates
4. Verify that duplicates are prevented
5. Confirm poster reveals after 50 registrations

## Google Sheet Structure
Your Google Sheet should look like this:

| Timestamp | Name | Class | Email | Mobile Number |
|-----------|------|-------|-------|---------------|
| (auto) | John Doe | 10A | john@example.com | 1234567890 |
| ... | ... | ... | ... | ... |

## Troubleshooting

### CORS Issues
- Make sure the Web App is deployed with "Who has access: Anyone"
- If you get CORS errors, redeploy the Web App

### Script Errors
- Check that the Spreadsheet ID is correct
- Ensure the sheet name is "Registrations" (or update SHEET_NAME in the script)
- Verify that the Apps Script has permission to access the sheet

### Poster Not Revealing
- Check the browser console for JavaScript errors
- Verify the Web App URL is correct in `script.js`
- Ensure the sheet has the correct column structure

### Form Validation
- Email must be in valid format (user@domain.com)
- Mobile number must be exactly 10 digits
- All fields are required

## Security Notes
- This setup allows anyone to read/write to your Google Sheet
- For production use, consider adding authentication or rate limiting
- The Web App URL should be kept private if you want to restrict access

## Customization
- Modify the blur effect in `style.css` (#poster.blurred)
- Change the registration threshold (50) in both `script.js` and `apps-script.js`
- Update colors and styling in `style.css`
- Add more form fields by updating HTML, JS, and Apps Script