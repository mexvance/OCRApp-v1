import { useRef} from 'react';
import CameraWrapper from '../components/CameraWrapper';
const OcrApp = () => {
  const webcamRef = useRef(null);

  return (
    <div >
      <h1>Live OCR App</h1>
      <CameraWrapper webcamRef={webcamRef} />
      <br />
      
    </div>
  );
};

export default OcrApp;