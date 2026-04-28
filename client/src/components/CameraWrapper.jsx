import { useState, useEffect } from "react";
import Camera from "./Camera";
import PropTypes from "prop-types";

const CameraWrapper = ({ webcamRef, setCameraReady, onCapture, captureLoading, cameraReady }) => {
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

        {/* Bottom-right: capture button */}
        {isCameraOn && cameraReady && (
          <div
            className={`camera-capture-btn${captureLoading ? ' loading' : ''}`}
            onClick={captureLoading ? undefined : onCapture}
            title="Capture and OCR"
          >
            {captureLoading ? '…' : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

CameraWrapper.propTypes = {
  webcamRef: PropTypes.object.isRequired,
  setCameraReady: PropTypes.func.isRequired,
  onCapture: PropTypes.func.isRequired,
  captureLoading: PropTypes.bool.isRequired,
  cameraReady: PropTypes.bool.isRequired,
};

export default CameraWrapper;
