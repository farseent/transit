import { useState } from 'react';
import Input from '../../common/Input';
import Select from '../../common/Select';

const BusForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    capacity: '',
    type: 'standard',
    features: []
  });

  const busTypes = [
    { value: 'standard', label: 'Standard' },
    { value: 'premium', label: 'Premium' },
    { value: 'luxury', label: 'Luxury' }
  ];

  const busFeatures = [
    { value: 'ac', label: 'Air Conditioning' },
    { value: 'wifi', label: 'WiFi' },
    { value: 'charging', label: 'Charging Ports' },
    { value: 'toilet', label: 'Toilet' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => {
      const features = prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature];
      return { ...prev, features };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Add New Bus</h2>
      
      <Input
        label="Bus Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      
      <Input
        label="Registration Number"
        name="registrationNumber"
        value={formData.registrationNumber}
        onChange={handleChange}
        required
      />
      
      <Input
        label="Capacity"
        name="capacity"
        type="number"
        value={formData.capacity}
        onChange={handleChange}
        required
      />
      
      <Select
        label="Bus Type"
        name="type"
        options={busTypes}
        value={formData.type}
        onChange={handleChange}
      />
      
      <div>
        <label className="block text-sm font-medium mb-2">Features</label>
        <div className="grid grid-cols-2 gap-2">
          {busFeatures.map(feature => (
            <label key={feature.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.features.includes(feature.value)}
                onChange={() => handleFeatureToggle(feature.value)}
                className="rounded"
              />
              <span>{feature.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Bus
        </button>
      </div>
    </form>
  );
};

export default BusForm;