import { useState, useEffect } from "react";
import Webcam from "react-webcam";
import PropTypes from "prop-types";

const Camera = ({ webcamRef, onCameraReady }) => {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch available video input devices on component mount
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
        console.error("Error enumerating devices: ", err);
      } finally {
        setLoading(false);
      }
    };

    // Request permissions so labels are available in some browsers
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        fetchDevices();
      })
      .catch((err) => {
        console.error("Error accessing camera: ", err);
        setLoading(false);
      });
  }, []);

  const handleDeviceChange = (e) => {
    setSelectedDeviceId(e.target.value);
  };

  // Set video constraints using the selected device ID
  const videoConstraints = {
    deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
  };

  if (loading) {
    // Show a loading message or spinner while connecting
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <p>Loading camera(s)...</p>
        {/* We can insert a spinner here if we want */}
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      {devices.length > 0 ? (
        <>
          <select onChange={handleDeviceChange} value={selectedDeviceId}>
            {devices.map((device, index) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${index + 1}`}
              </option>
            ))}
          </select>
          <div style={{ marginTop: "1rem" }}>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              style={{ width: "100%", maxWidth: "400px" }}
              onUserMedia={onCameraReady} // Notify parent when stream is available
            />
          </div>
        </>
      ) : (
        <p>No cameras found or permission denied.</p>
      )}
    </div>
  );
};
Camera.propTypes = {
  webcamRef: PropTypes.object.isRequired,
  onCameraReady: PropTypes.object.isRequired,
}

export default Camera;
