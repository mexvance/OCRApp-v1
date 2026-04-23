import rules from '../assets/rules.json';
import PropTypes from 'prop-types';

const OCRFilterComponent = ({ selectedRegex, onRuleChange }) => {
  const handleChange = (e) => {
    const rule = rules.find(r => r.regex === e.target.value);
    if (rule) onRuleChange(rule);
  };

  return (
    <div className="input-field">
      <label htmlFor="filterSelect">Text Matching Type:</label>
      <select id="filterSelect" value={selectedRegex} onChange={handleChange}>
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
  selectedRegex: PropTypes.string.isRequired,
  onRuleChange: PropTypes.func.isRequired,
};

export default OCRFilterComponent;
