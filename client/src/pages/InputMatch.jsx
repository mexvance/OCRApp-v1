import { useRef, useState, useEffect } from "react";
import CameraWrapper from "../components/CameraWrapper";
import OCRFilterComponent from "../components/OCRFilterComponent";
import compareValues from "../Services/compareService";
import OCRComponent from "../components/OCRComponent";

const InputMatch = () => {
  const webcamRef = useRef(null);
  const [userInput, setUserInput] = useState("");
  const [ocrResult, setOcrResult] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const [filteredText, setFilteredText] = useState("");
  const [similarity, setSimilarity] = useState(0);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  useEffect(() => {
    const normalizedOcr = filteredText
      .split(/\r?\n/)
      .join(" ")
      .trim()
      .toUpperCase();
    const normalizedUserInput = userInput.trim().toUpperCase();

    const lev = compareValues(normalizedUserInput, normalizedOcr);

    if (lev && lev !== undefined) {
      setSimilarity(lev.similarity * 100);
    } else {
      setSimilarity(0);
    }
  }, [userInput, filteredText]);

  return (
    <div className="ocr-text-match-container">
      <h2>OCR Text Match</h2>

      <CameraWrapper webcamRef={webcamRef} setCameraReady={setCameraReady} cameraReady={cameraReady}/>

      <OCRFilterComponent
        ocrResult={ocrResult}
        filteredText={setFilteredText}
      />
      <div className="input-field">
        <label htmlFor="ItemInput">
          Input Text here:
          <input
            type="text"
            id="ItemInput"
            name="ItemInput"
            value={userInput}
            onChange={handleInputChange}
          />
        </label>
      </div>

      <OCRComponent webcamRef={webcamRef} onOcrResult={setOcrResult} cameraReady={cameraReady}/>
      <div className="output-section">
        <strong>OCR Output:</strong>
        <p>{ocrResult}</p>
      </div>

      {ocrResult && (
        <div className="output-section">
          <strong>Filtered Output:</strong>
          <p>{filteredText ? filteredText : "No matching text found"}</p>
        </div>
      )}

      {ocrResult && (
        <div className="similarity-section">
          <h2>Similarity: {similarity.toFixed(2)}%</h2>
        </div>
      )}
    </div>
  );
};

export default InputMatch;
