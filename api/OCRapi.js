const express = require('express');
const bodyParser = require('body-parser');
const { ImageAnnotatorClient } = require('@google-cloud/vision');

const app = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Increase limit if needed
require('dotenv').config({path:'api.env'});
// Create a client
const client = new ImageAnnotatorClient();

app.post('/api/vision-ocr', async (req, res) => {
  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ error: 'Image URL is required.' });
  }
  // Remove the data URL header (e.g., "data:image/jpeg;base64,")
  const base64Image = image.split(',')[1];
  
  try {
    //Call Google API text detection
    const [result] = await client.textDetection({
      image: { content: base64Image },
    });

    // Extract the full text you could filter out the formatting at this point if you want to use regex etc.
    const detections = result.textAnnotations;
    const fullText = detections && detections.length > 0 ? detections[0].description : '';
    
    res.json({ text: fullText });
  } catch (error) {
    console.error('Google Vision API error:', error);
    res.status(500).json({ error: 'Error processing OCR' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));