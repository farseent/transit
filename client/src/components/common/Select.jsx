// components/common/Select.jsx
const Select = ({ label, name, options = [], value, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded"
    >
      {options && options.length > 0 ? (
        options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))
      ) : (
        <option disabled>No options available</option>
      )}
    </select>
  </div>
);

export default Select;
