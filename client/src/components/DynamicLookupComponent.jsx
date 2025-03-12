import { useState, useEffect } from "react";
// Assume you import your configuration from a file or API.
import lookupConfigs from "../assets/lookupConfigs.json";
import PropTypes from "prop-types";
import lookupMethods from "../Services/LookupServices"

const DynamicValidationComponent = ({ ocrResult }) => {
  const [userInput, setUserInput] = useState("");
  const [lookupValue, setLookupValue] = useState("");
  const [selectedConfigIndex, setSelectedConfigIndex] = useState(0);
  const [validationMessage, setValidationMessage] = useState("");

  const handleInputChange = (e) => setUserInput(e.target.value);

  const handleConfigChange = (e) =>
    setSelectedConfigIndex(parseInt(e.target.value, 10));

  useEffect(() => {
    // When the selected config or user input changes, perform the lookup.
    const performLookup = async () => {
      try {
        const config = lookupConfigs[selectedConfigIndex];
        console.log(config)
        const value = await lookupMethods.query(config, userInput);
        setLookupValue(value);
      } catch (err) {
        console.error(err);
        setLookupValue("Error performing lookup");
      }
    };
    performLookup();
  }, [selectedConfigIndex, userInput]);

  useEffect(() => {
    // Validate the OCR result against the lookup value.
    if (ocrResult && lookupValue) {
      setValidationMessage(
        ocrResult.trim() === lookupValue.trim() ? "Match" : "No Match"
      );
    }
  }, [ocrResult, lookupValue]);

  return (
    <div >
      <h1>Dynamic Validation</h1>
      <div>
        <label>
          Select Lookup Method:{" "}
          <select value={selectedConfigIndex} onChange={handleConfigChange}>
            {lookupConfigs.map((config, index) => (
              <option key={index} value={index}>
                {config.type}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div >
        <label>
          Enter Value:
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            
          />
        </label>
      </div>
      <div >
        <p>
          <strong>Lookup Value:</strong> {lookupValue}
        </p>
        <p>
          <strong>OCR Output:</strong> {ocrResult}
        </p>
        <p>
          <strong>Validation:</strong> {validationMessage}
        </p>
      </div>
    </div>
  );
};
DynamicValidationComponent.propTypes = {
  ocrResult: PropTypes.object.isRequired,
};

export default DynamicValidationComponent;
