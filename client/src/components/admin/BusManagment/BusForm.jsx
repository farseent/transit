import { useState, useEffect } from 'react';
import Input from '../../common/Input';
import Select from '../../common/Select';

const BusForm = ({ onSubmit, onCancel, owners = [], routes = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    regNumber: '',
    owner: '',
    route: '',
    schedules: [{ departureTime: '' }],
    isAvailable: true
  });

  useEffect(() => {
    // Ensure that owners and routes are available before updating the form
    if (owners.length > 0) {
      setFormData(prev => ({ ...prev, owner: owners[0]._id }));
    }
    if (routes.length > 0) {
      setFormData(prev => ({ ...prev, route: routes[0]._id }));
    }
  }, [owners, routes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = (index, e) => {
    const { name, value } = e.target;
    const newSchedules = [...formData.schedules];
    newSchedules[index][name] = value;
    setFormData(prev => ({ ...prev, schedules: newSchedules }));
  };

  const handleAddSchedule = () => {
    setFormData(prev => ({ ...prev, schedules: [...prev.schedules, { departureTime: '' }] }));
  };

  const handleRemoveSchedule = (index) => {
    const newSchedules = formData.schedules.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, schedules: newSchedules }));
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
        name="regNumber"
        value={formData.regNumber}
        onChange={handleChange}
        required
      />

      {/* Select for Owner */}
      <Select
        label="Owner"
        name="owner"
        options={owners.map(owner => ({ value: owner._id, label: owner.name }))}
        value={formData.owner}
        onChange={handleChange}
        required
      />

      {/* Select for Route */}
      <Select
        label="Route"
        name="route"
        options={routes.map(route => ({ value: route._id, label: route.name }))}
        value={formData.route}
        onChange={handleChange}
        required
      />

      {/* Schedules */}
      <div>
        <label className="block text-sm font-medium mb-2">Schedules</label>
        {formData.schedules.map((schedule, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              label="Departure Time"
              name="departureTime"
              value={schedule.departureTime}
              onChange={(e) => handleScheduleChange(index, e)}
              placeholder="HH:MM"
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveSchedule(index)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddSchedule}
          className="text-blue-500"
        >
          Add Schedule
        </button>
      </div>

      {/* Availability */}
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium">Is Available</label>
        <input
          type="checkbox"
          name="isAvailable"
          checked={formData.isAvailable}
          onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
        />
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
