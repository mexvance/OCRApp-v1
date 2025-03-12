import { useState, useEffect } from "react";
import Camera from "./Camera"; // your simplified Camera component
import PropTypes from "prop-types";

const CameraWrapper = ({ webcamRef, setCameraReady, cameraReady}) => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");

  const toggleCamera = () => {
    if (isCameraOn) {
      if (webcamRef.current && webcamRef.current.stream) {
        webcamRef.current.stream.getTracks().forEach((track) => track.stop());
      }
      setIsCameraOn(false);
      setCameraReady(false);
    } else {
      setIsCameraOn(true);
    }
  };

  // Fetch devices on mount
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(
          (device) => device.kind === "videoinput"
        );
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (err) {
        console.error("Error fetching devices:", err);
      }
    };

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => fetchDevices())
      .catch((err) => console.error("Error accessing camera:", err));
  }, []);

  return (
    <div className="camera-wrapper-container">
      <div className="camera-container">
        {/* Top-right icon to turn off */}
        {isCameraOn && (
          <div
            className="camera-toggle"
            onClick={toggleCamera}
            title="Turn Off Camera"
          >
            ✖
          </div>
        )}

        {/* Camera feed or placeholder */}
        {isCameraOn ? (
          <Camera
            webcamRef={webcamRef}
            onCameraReady={() => setCameraReady(true)}
            selectedDeviceId={selectedDeviceId}
          />
        ) : (
          <div className="camera-placeholder" onClick={toggleCamera}>
            <div className="camera-icon">+</div>
            <p>Click to turn camera on</p>
          </div>
        )}
      </div>
      {cameraReady ? (
        <>
          <div className="camera-controls">
            {devices.length > 0 && (
              <select
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                value={selectedDeviceId}
              >
                {devices.map((device, index) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${index + 1}`}
                  </option>
                ))}
              </select>
            )}

          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

CameraWrapper.propTypes = {
  webcamRef: PropTypes.object.isRequired,
  onOcrResult: PropTypes.func.isRequired,
  setCameraReady: PropTypes.func.isRequired,
  cameraReady: PropTypes.string.isRequired,
};

export default CameraWrapper;
