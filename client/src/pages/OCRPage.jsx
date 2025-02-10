import React, { useRef} from 'react';
import CameraWrapper from '../components/CameraWrapper';
const OcrApp = () => {
  const webcamRef = useRef(null);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Live OCR App</h1>
      <CameraWrapper webcamRef={webcamRef}/>
      <br />
      
    </div>
  );
};

export default OcrApp;