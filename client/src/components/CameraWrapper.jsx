import { useState, useEffect } from "react";
import Camera from "./Camera";
import PropTypes from "prop-types";

const CameraWrapper = ({ webcamRef, setCameraReady }) => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [selectorOpen, setSelectorOpen] = useState(false);

  const toggleCamera = () => {
    if (isCameraOn) {
      if (webcamRef.current && webcamRef.current.stream) {
        webcamRef.current.stream.getTracks().forEach((track) => track.stop());
      }
      setIsCameraOn(false);
      setCameraReady(false);
      setSelectorOpen(false);
    } else {
      setIsCameraOn(true);
    }
  };

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter((d) => d.kind === "videoinput");
        setDevices(videoDevices);
        if (videoDevices.length > 0) setSelectedDeviceId(videoDevices[0].deviceId);
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

        {/* Top-right: close camera */}
        {isCameraOn && (
          <div className="camera-toggle" onClick={toggleCamera} title="Turn Off Camera">
            ✖
          </div>
        )}

        {/* Top-left: camera selector (only when multiple cameras exist) */}
        {isCameraOn && devices.length > 1 && (
          <div className="camera-selector-overlay">
            <div
              className="camera-selector-icon"
              onClick={() => setSelectorOpen((o) => !o)}
              title="Switch Camera"
            >
              ⇄
            </div>
            {selectorOpen && (
              <select
                className="camera-selector-dropdown"
                value={selectedDeviceId}
                onChange={(e) => {
                  setSelectedDeviceId(e.target.value);
                  setSelectorOpen(false);
                }}
              >
                {devices.map((device, index) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${index + 1}`}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

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
    </div>
  );
};

CameraWrapper.propTypes = {
  webcamRef: PropTypes.object.isRequired,
  setCameraReady: PropTypes.func.isRequired,
};

export default CameraWrapper;
