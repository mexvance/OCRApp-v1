import Webcam from "react-webcam";
import PropTypes from "prop-types";

const Camera = ({ webcamRef, onCameraReady, selectedDeviceId }) => {
  const videoConstraints = {
    deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
  };

  return (
    <div className="camera-feed">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        onUserMedia={onCameraReady}
        
      />
    </div>
  );
};

Camera.propTypes = {
  webcamRef: PropTypes.object.isRequired,
  onCameraReady: PropTypes.func.isRequired,
  selectedDeviceId: PropTypes.string.isRequired
};

export default Camera;
