import React, { useState, useEffect } from 'react';
import rules from '../assets/rules.json';

const OCRFilterComponent = ({ ocrResult, filteredText }) => {
  // Initialize state with the first rule from the JSON.
  const [selectedRule, setSelectedRule] = useState(rules[0].regex);
  const [selectedFlags, setSelectedFlags] = useState(rules[0].flags);

  // Handler to update the selected rule when the user changes the dropdown
  const handleRuleChange = (e) => {
    const newRule = rules.find(rule => rule.regex === e.target.value);
    if (newRule) {
      setSelectedRule(newRule.regex);
      setSelectedFlags(newRule.flags || "");
    }
  };

  // When the OCR result or the selected rule/flags change, perform a regex match
  useEffect(() => {
    if (ocrResult && selectedRule) {
        const regex = new RegExp(selectedRule, selectedFlags);
        const match = ocrResult.match(regex);
        console.log(match)
        filteredText(match ? match[0] : "");
    } else {
        filteredText("");
    }
  }, [ocrResult, selectedRule, filteredText, selectedFlags]);

  return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      <label>
        Select Filter:{' '}
        <select value={selectedRule} onChange={handleRuleChange}>
          {rules.map((rule) => (
            <option key={rule.label} value={rule.regex}>
              {rule.label}
            </option>
          ))}
        </select>
      </label>
      
      </div>
  );
};

export default OCRFilterComponent;
