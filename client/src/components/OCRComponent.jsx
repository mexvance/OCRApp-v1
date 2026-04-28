import PropTypes from 'prop-types';

const OCRComponent = ({ onCapture, loading, cameraReady }) => (
  <button onClick={onCapture} disabled={loading || !cameraReady}>
    {loading ? 'Processing...' : 'Capture and OCR'}
  </button>
);

OCRComponent.propTypes = {
  onCapture: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  cameraReady: PropTypes.bool.isRequired,
};

export default OCRComponent;
