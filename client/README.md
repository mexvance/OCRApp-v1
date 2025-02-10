# Live OCR App

This project is a demo application that captures live webcam images and performs Optical Character Recognition (OCR) on them using the Google Vision API. It’s built with React on the frontend and Node/Express on the backend. The app supports toggling the camera on/off, selecting from multiple cameras, and displays the text content upon submission of the image.

## Features

- **Live Camera Feed:** Toggle the webcam on and off.
- **Multiple Camera Support:** Choose from available video input devices.
- **Loading Indicator:** Displays a loading message while the camera connects.
- **OCR Processing:** Captures a screenshot and sends it to a backend API which uses the Google Vision API to extract text.
- **Clean UI:** The OCR result is displayed in a user-friendly format.

## Prerequisites

- Node.js (v12 or higher recommended)
- npm (or yarn)
- A Google Cloud account with the Vision API enabled and a service account JSON key

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/live-ocr-app.git
   cd live-ocr-app
   ```

## Setup

### 
    Client Initial Setup:

    Navigate to the client folder and install dependencies:

```bash
npm install
```

### API Initial Setup:

    Navigate to the api folder and install dependencies

```bash
npm install
```

### API Environment Variables

1. In the `/api` folder, create a `.env` file with the following content:

   ```env
   GOOGLE_APPLICATION_CREDENTIALS="/path/apicredentialfile.json"
   ```

   Note: Replace /path/apicredentialfile.json with the actual path to your own Google JSON service account credential file.

   In my code I created a file called api.env and manually added the env path as shown below:

   ```javascript
   require('dotenv').config({path:'api.env'});
   ```

   Change that config path as needed based on your env naming convention

## Running the Application

### Start the Client:

    From the client folder, run:

```bash
npm run dev
```

    This will start the React development server (typically available at http://localhost:5173).

### Start the API:

    From the api folder, run:

```bash
node OCRapi.js
```

    This will start the Express server on the default port 5000 (http://localhost:5000).

## Usage

### Toggle Camera:

    Click the "Turn On Camera" button to activate the webcam. The app will display a loading indicator until the camera stream is ready.

### Camera Device Selection:

    If multiple cameras are available, select your preferred device from the dropdown menu.

### Capture and OCR:

    Once the camera is active and ready, the "Capture and OCR" button will appear. Click this button to capture an image and send it to the backend for OCR processing via the Google Vision API. The recognized text will then be displayed in the UI.

## Troubleshooting

### CORS Issues:

    Ensure that your API is configured with the cors middleware to allow requests from your client. For example, in your API setup:

```javascript
const cors = require('cors');
app.use(cors());
```

### Camera Permissions:

    Make sure your browser has permission to access the webcam.

### Environment Variables:

    Verify that your .env file in the /api folder is correctly configured with the proper path to your Google credentials.

## License

This project is licensed under the MIT License.
