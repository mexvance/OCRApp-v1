import { useState } from 'react';
import callGoogleAPI from '../Services/callGoogleAPI';

const OCRComponent = ({ webcamRef, onOcrResult, ocrResult }) => {
  const [loading, setLoading] = useState(false);

  const captureAndOcr = async () => {
    // Capture a screenshot from the webcam
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setLoading(true);

    try {
      // Run OCR on the captured image using Google Vision API
      const text = await callGoogleAPI(imageSrc);
      onOcrResult(text);
    } catch (error) {
      console.error('OCR error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={captureAndOcr} disabled={loading} style={{ marginTop: '1rem' }}>
        {loading ? 'Processing...' : 'Capture and OCR'}
      </button>
      {ocrResult && (
        <div style={{ marginTop: '1rem', textAlign: 'left', maxWidth: '400px', margin: 'auto' }}>
          <h2>OCR Result:</h2>
          <p>{ocrResult}</p>
        </div>
      )}
    </>
  );
};

export default OCRComponent;
