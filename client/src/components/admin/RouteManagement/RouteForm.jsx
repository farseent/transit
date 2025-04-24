import { useState } from 'react';
import Input from '../../common/Input';

const RouteForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    startPoint: '',
    endPoint: '',
    stops: [],
    baseFare: 0
  });

  const [newStop, setNewStop] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStop = () => {
    if (newStop.trim()) {
      setFormData(prev => ({
        ...prev,
        stops: [...prev.stops, { name: newStop.trim(), fareFromStart: 0 }]
      }));
      setNewStop('');
    }
  };

  const handleRemoveStop = (index) => {
    setFormData(prev => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index)
    }));
  };

  const handleStopFareChange = (index, value) => {
    const updatedStops = [...formData.stops];
    updatedStops[index].fareFromStart = Number(value);
    setFormData(prev => ({ ...prev, stops: updatedStops }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Create New Route</h2>
      
      <Input
        label="Route Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      
      <Input
        label="Start Point"
        name="startPoint"
        value={formData.startPoint}
        onChange={handleChange}
        required
      />
      
      <Input
        label="End Point"
        name="endPoint"
        value={formData.endPoint}
        onChange={handleChange}
        required
      />
      
      <Input
        label="Base Fare"
        name="baseFare"
        type="number"
        value={formData.baseFare}
        onChange={handleChange}
        required
      />
      
      <div>
        <label className="block text-sm font-medium mb-2">Route Stops</label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={newStop}
            onChange={(e) => setNewStop(e.target.value)}
            placeholder="Add a stop"
            className="flex-1 p-2 border rounded"
          />
          <button
            type="button"
            onClick={handleAddStop}
            className="px-3 bg-blue-500 text-white rounded"
          >
            Add
          </button>
        </div>
        
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {formData.stops.map((stop, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 border rounded">
              <span className="flex-1">{stop.name}</span>
              <input
                type="number"
                value={stop.fareFromStart}
                onChange={(e) => handleStopFareChange(index, e.target.value)}
                placeholder="Fare from start"
                className="w-24 p-1 border rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveStop(index)}
                className="px-2 text-red-500"
              >
                Remove
              </button>
            </div>
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
          Create Route
        </button>
      </div>
    </form>
  );
};

export default RouteForm;