import React, { useState } from 'react';
import Camera from './Camera';
import OCRComponent from './OCRComponent';

const CameraWrapper = ({ webcamRef }) => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const toggleCamera = () => {
    if (isCameraOn) {
      // Stop the media stream tracks to turn off the camera
      if (webcamRef.current && webcamRef.current.stream) {
        webcamRef.current.stream.getTracks().forEach(track => track.stop());
      }
      setIsCameraOn(false);
      setCameraReady(false); // Reset the ready flag when turning off
    } else {
      setIsCameraOn(true);
    }
  };

  // Callback to be called when the Camera component is ready (via onUserMedia)
  const handleCameraReady = () => {
    setCameraReady(true);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <button onClick={toggleCamera}>
        {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
      </button>
      {isCameraOn && (
        <>
          <Camera webcamRef={webcamRef} onCameraReady={handleCameraReady} />
          {cameraReady && (
            <OCRComponent webcamRef={webcamRef} />
          )}
        </>
      )}
    </div>
  );
};

export default CameraWrapper;
