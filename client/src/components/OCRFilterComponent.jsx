import { useState, useEffect } from 'react';
import rules from '../assets/rules.json';
import PropTypes from 'prop-types';

const OCRFilterComponent = ({ ocrResult, filteredText }) => {
  const [selectedRule, setSelectedRule] = useState(rules[0].regex);
  const [selectedFlags, setSelectedFlags] = useState(rules[0].flags);

  const handleRuleChange = (e) => {
    const newRule = rules.find(rule => rule.regex === e.target.value);
    if (newRule) {
      setSelectedRule(newRule.regex);
      setSelectedFlags(newRule.flags || "");
    }
  };

  useEffect(() => {
    if (ocrResult && selectedRule) {
      const regex = new RegExp(selectedRule, selectedFlags);
      const match = ocrResult.match(regex);
      console.log(match);
      filteredText(match ? match[0] : "");
    } else {
      filteredText("");
    }
  }, [ocrResult, selectedRule, filteredText, selectedFlags]);

  return (
    <div className="input-field">
      <label htmlFor="filterSelect">Select Text Matching Type:</label>
      <select
        id="filterSelect"
        value={selectedRule}
        onChange={handleRuleChange}
      >
        {rules.map((rule) => (
          <option key={rule.label} value={rule.regex}>
            {rule.label}
          </option>
        ))}
      </select>
    </div>
  );
};

OCRFilterComponent.propTypes = {
  ocrResult: PropTypes.string.isRequired,      // It's a string result from OCR
  filteredText: PropTypes.func.isRequired,     // Function to set filtered text
};

export default OCRFilterComponent;
