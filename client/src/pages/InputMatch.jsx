import { useRef, useState, useEffect } from "react";
import CameraWrapper from "../components/CameraWrapper";
import OCRFilterComponent from "../components/OCRFilterComponent";
import compareValues from "../Services/compareService";
import OCRComponent from "../components/OCRComponent";
import callGoogleAPI from "../Services/callGoogleAPI";
import { saveEntry, updateEntry } from "../Services/logService";
import rules from "../assets/rules.json";

// Rules that can be auto-detected (skip "No Filter" which matches everything)
const detectableRules = rules.filter((r) => r.regex !== ".*");

const InputMatch = () => {
  const webcamRef = useRef(null);
  const [userInput, setUserInput] = useState("");
  const [ocrResult, setOcrResult] = useState("");
  const [filteredText, setFilteredText] = useState("");
  const [similarity, setSimilarity] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeRule, setActiveRule] = useState(rules[0]);
  const [settingsOpen, setSettingsOpen] = useState(window.innerWidth >= 768);
  const [captureLoading, setCaptureLoading] = useState(false);
  const hasLoggedScan = useRef(false);
  const currentLogId = useRef(null);

  const captureAndOcr = async () => {
    if (!cameraReady || !webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;
    setCaptureLoading(true);
    try {
      const text = await callGoogleAPI(imageSrc);
      handleOcrResult(text);
    } catch (err) {
      console.error('OCR error:', err);
    } finally {
      setCaptureLoading(false);
    }
  };

  // Auto-detect best matching rule from barcode input
  useEffect(() => {
    const input = userInput.trim();
    const matched = detectableRules.find((r) => {
      try {
        const flags = (r.flags || "i").replace(/[gms]/g, "");
        return new RegExp(`^(?:${r.regex})$`, flags).test(input);
      } catch {
        return false;
      }
    });
    setActiveRule(matched || rules[0]);
  }, [userInput]);

  // Apply active rule filter whenever ocrResult or activeRule changes
  useEffect(() => {
    if (!ocrResult) {
      setFilteredText("");
      return;
    }
    try {
      const regex = new RegExp(activeRule.regex, activeRule.flags || "");
      const match = ocrResult.match(regex);
      setFilteredText(match ? match[0] : "");
    } catch {
      setFilteredText("");
    }
  }, [ocrResult, activeRule]);

  // Similarity score
  useEffect(() => {
    const input = userInput.trim();
    const ocr = filteredText.trim();
    if (input && ocr) {
      const lev = compareValues(
        input.toUpperCase(),
        ocr.split(/\r?\n/).join(" ").toUpperCase()
      );
      setSimilarity(lev?.similarity * 100 || 0);
    } else {
      setSimilarity(0);
    }
  }, [userInput, filteredText]);

  // Reset log flag on new scan
  useEffect(() => {
    if (ocrResult) hasLoggedScan.current = false;
  }, [ocrResult]);

  // Log once per scan after filteredText settles
  useEffect(() => {
    if (ocrResult && !hasLoggedScan.current) {
      hasLoggedScan.current = true;
      const input = userInput.trim();
      const ocr = filteredText.trim();
      let logSimilarity = 0;
      if (input && ocr) {
        const lev = compareValues(
          input.toUpperCase(),
          ocr.split(/\r?\n/).join(" ").toUpperCase()
        );
        logSimilarity = lev?.similarity * 100 || 0;
      }
      currentLogId.current = saveEntry({
        barcode: userInput,
        rawOCR: ocrResult,
        filteredOCR: filteredText,
        similarity: logSimilarity,
        rule: activeRule.label,
      });
    }
  }, [filteredText]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOcrResult = (rawText) => {
    setOcrResult(rawText);
    setShowModal(true);
  };

  const clearState = () => {
    setUserInput("");
    setOcrResult("");
    setFilteredText("");
    setShowModal(false);
  };

  const handleConfirm = () => {
    updateEntry(currentLogId.current, { disposition: 'confirmed' });
    clearState();
  };

  const handleDismiss = () => {
    updateEntry(currentLogId.current, { disposition: 'dismissed' });
    setShowModal(false);
  };

  const bgColors = { success: "#baffc9", warning: "#ffdfba", error: "#ffb3ba" };
  const status = similarity >= 100 ? "success" : similarity >= 75 ? "warning" : "error";
  const modalBg = bgColors[status];

  return (
    <div className="ocr-text-match-container">

      <CameraWrapper
        webcamRef={webcamRef}
        setCameraReady={setCameraReady}
        cameraReady={cameraReady}
        onCapture={captureAndOcr}
        captureLoading={captureLoading}
      />

      <div className="input-field">
        <label htmlFor="ItemInput">Barcode:</label>
        <div className="input-with-clear">
          <input
            type="text"
            id="ItemInput"
            name="ItemInput"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          {userInput && (
            <button
              className="input-clear-btn"
              onClick={() => setUserInput("")}
              aria-label="Clear barcode"
              tabIndex={-1}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="capture-wrapper">
        <OCRComponent
          onCapture={captureAndOcr}
          loading={captureLoading}
          cameraReady={cameraReady}
        />
      </div>
      <details
        className="settings-panel"
        open={settingsOpen}
        onToggle={(e) => setSettingsOpen(e.target.open)}
      >
        <summary>
          Settings
          {userInput.trim() && activeRule.regex !== ".*" && (
            <span className="auto-rule-badge">auto: {activeRule.label}</span>
          )}
        </summary>
        <OCRFilterComponent
          selectedRegex={activeRule.regex}
          onRuleChange={setActiveRule}
        />
        
      </details>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal" style={{ backgroundColor: modalBg }}>
            <button className="modal-close" onClick={handleDismiss}>
              ×
            </button>
            <h2>Scanning Results</h2>
             <div>
              <strong>Barcode Input:</strong>
              <p>{userInput}</p>
            </div>
            <div>
              <strong>Processed Image Output:</strong>
              <p>{filteredText || "No matching text found"}</p>
            </div>
            <div>
              <strong>Raw Image Scan:</strong>
              <p>{ocrResult}</p>
            </div>
            <div>
              <strong>Similarity Match:</strong>
              <p>{similarity.toFixed(2)}%</p>
            </div>
            <div className="mt-4 text-center">
              <button onClick={handleConfirm}>Confirm and Clear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputMatch;
