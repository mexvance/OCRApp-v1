import { useRef, useState, useEffect } from "react";
import CameraWrapper from "../components/CameraWrapper";
import OCRFilterComponent from "../components/OCRFilterComponent";
import compareValues from "../Services/compareService";
import OCRComponent from "../components/OCRComponent";

const InputMatch = () => {
  const webcamRef = useRef(null);
  const [userInput, setUserInput] = useState("");
  const [ocrResult, setOcrResult] = useState("");
  const [filteredText, setFilteredText] = useState("");
  const [similarity, setSimilarity] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  useEffect(() => {
    const input = userInput.trim();
    const ocr = filteredText.trim();

    // only compute if both have real content
    if (input !== "" && ocr !== "") {
      const normalizedOcr = ocr.split(/\r?\n/).join(" ").toUpperCase();
      const normalizedUserInput = input.toUpperCase();

      const lev = compareValues(normalizedUserInput, normalizedOcr);
      setSimilarity(lev?.similarity * 100 || 0);
    } else {
      setSimilarity(0);
    }
  }, [userInput, filteredText]);

  const handleOcrResult = (rawText) => {
    setOcrResult(rawText);
    setShowModal(true);
  };

  const handleConfirm = () => {
    setUserInput("");
    setOcrResult("");
    setFilteredText("");
    setShowModal(false);
  };
  // Map status to actual hex colors
  const bgColors = {
    success: "#baffc9",
    warning: "#ffdfba",
    error: "#ffb3ba",
  };
  const status =
    similarity >= 100 ? "success" : similarity >= 75 ? "warning" : "error";
  const modalBg = bgColors[status];

  return (
    <div className="ocr-text-match-container">
      <h2>OCR Text Match</h2>

      <CameraWrapper
        webcamRef={webcamRef}
        setCameraReady={setCameraReady}
        cameraReady={cameraReady}
      />
      <button
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        onClick={handleConfirm}
      >
        Clear Input
      </button>
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

      <OCRComponent
        webcamRef={webcamRef}
        onOcrResult={handleOcrResult}
        cameraReady={cameraReady}
      />

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal" style={{ backgroundColor: modalBg }}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h2>Scanning Results</h2>
            <div>
              <strong>Raw Image Capture:</strong>
              <p>{ocrResult}</p>
            </div>
            <div>
              <strong>Filtered Output:</strong>
              <p>{filteredText || "No matching text found"}</p>
            </div>
            <div>
              <strong>Similarity Match:</strong>
              <p>{similarity.toFixed(2)}%</p>
            </div>
            <div className="mt-4 text-center">
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleConfirm}
              >
                Confirm and Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputMatch;
