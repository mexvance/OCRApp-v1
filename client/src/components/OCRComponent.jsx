import { useState } from 'react';
import callGoogleAPI from '../Services/callGoogleAPI';
import PropTypes from 'prop-types';
const OCRComponent = ({ webcamRef, onOcrResult, cameraReady }) => {
  const [loading, setLoading] = useState(false);

  const captureAndOcr = async () => {
    // Capture a screenshot from the webcam
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setLoading(true);

    try {
      // Run OCR on the captured image using Google Vision API
      console.log(imageSrc)
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
      <button onClick={captureAndOcr} disabled={loading || !cameraReady} >
        {loading ? 'Processing...' : 'Capture and OCR'}
      </button>
    </>
  );
};
OCRComponent.propTypes = {
  webcamRef: PropTypes.object.isRequired,
  onOcrResult: PropTypes.func.isRequired,
  ocrResult: PropTypes.string.isRequired,
  cameraReady: PropTypes.string.isRequired,
}

export default OCRComponent;
