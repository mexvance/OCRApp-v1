import { useRef, useState, useEffect } from 'react';
import CameraWrapper from '../components/CameraWrapper';
import OCRFilterComponent from '../components/OCRFilterComponent';
import compareValues from '../Services/compareService';

const InputMatch = () => {
  const webcamRef = useRef(null);
  const [userInput, setUserInput] = useState("");
  const [ocrResult, setOcrResult] = useState("");
  const [filteredText, setFilteredText] = useState("");
  const [similarity, setSimilarity] = useState(0);

  // Update user input state on every change
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  // Calculate similarity whenever userInput or filteredText changes.
  useEffect(() => {
    // Normalize both strings (e.g., remove extra whitespace, uppercase them)
    const normalizedOcr = filteredText.split(/\r?\n/).join(' ').trim().toUpperCase();
    const normalizedUserInput = userInput.trim().toUpperCase();
    
    const lev = compareValues(normalizedUserInput, normalizedOcr);
    console.log(lev)
    console.log(filteredText)
    if (lev && lev !== undefined) {
      setSimilarity(lev.similarity* 100);
    } else {
      setSimilarity(0);
    }
  }, [userInput, filteredText]);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>OCR Input Checker</h1>
      {/* CameraWrapper will update ocrResult via the callback */}
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
      </label>
      {/* OCRFilterComponent is responsible for updating filteredText */}
      <OCRFilterComponent ocrResult={ocrResult} filteredText={setFilteredText} />
      <br />
      <div style={{ marginTop: '1rem' }}>
        <strong>OCR Output:</strong>
        <p>{ocrResult}</p>
      </div>
      <div style={{ marginTop: '1rem' }}>
        {ocrResult && (
          <>
            <strong>Filtered Output:</strong>{' '}
            <p>{filteredText ? filteredText : 'No matching text found'}</p>
            
          </>
          
        )}
        
      </div>
      <div style={{ marginTop: '1rem' }}>
        {ocrResult && (
          <h2>Similarity: {similarity.toFixed(2)}%</h2>
        )}
      </div>
    </div>
  );
};

export default InputMatch;
