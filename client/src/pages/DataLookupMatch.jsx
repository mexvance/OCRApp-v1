import { useRef, useState } from 'react';
import CameraWrapper from '../components/CameraWrapper';
import OCRFilterComponent from '../components/OCRFilterComponent';
import DynamicValidationComponent from '../components/DynamicLookupComponent';
const InputMatch = () => {
  const webcamRef = useRef(null);
  const [userInput, setUserInput] = useState("");
  const [ocrResult, setOcrResult] = useState("");
  const [filteredText, setFilteredText] = useState("");
  // Update user input state on every change
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  // A simple equality check (you can expand this for fuzzy matching if needed)
  const isMatch = () => {
    const normalizedOcr = filteredText.split(/\r?\n/).join(' ').trim().toUpperCase();
    const normalizedUserInput = userInput.trim().toUpperCase();

    return normalizedOcr === normalizedUserInput;
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>OCR Value Lookup Checker</h1>
      <DynamicValidationComponent ocrResult={ocrResult}/>
      {/* Pass a callback so that CameraWrapper can send the OCR result back */}
      <CameraWrapper webcamRef={webcamRef} onOcrResult={setOcrResult} />
      <br />
      <label style={{ marginTop: '1rem', display: 'block' }}>
        Input Text here:
        <input
          type="text"
          name="ItemInput"
          value={userInput}
          onChange={handleInputChange}
          style={{ marginLeft: '0.5rem' }}
        />
        Handle data lookup tied to this input for your search item in this box
      </label>
      {/* Render the OCR filter component */}
      <OCRFilterComponent ocrResult={ocrResult} filteredText={setFilteredText}/>
      <br />
      <div style={{ marginTop: '1rem' }}>
        <h2>OCR Output:</h2>
        <p>{ocrResult}</p>
      </div>

      <div style={{ marginTop: '1rem' }}>
        {ocrResult && (<>
              <strong>Filtered Output:</strong>{' '}
            
              {filteredText ? filteredText : 'No matching text found'}
            </>
        )}
        </div>
      <div>
        {ocrResult && (
          <h2>{ isMatch() ? "Match" : "No Match" }</h2>
        )}
      </div>
    </div>
  );
};

export default InputMatch;
