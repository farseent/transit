import { useState, useEffect } from 'react';
import Input from '../../common/Input';
import Select from '../../common/Select';
import Button from '../../common/Button';

const BusForm = ({ initialData, onSubmit, onCancel, owners = [], routes = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    regNumber: '',
    owner: '',
    route: '',
    schedules: [{ departureTime: '' }],
    isAvailable: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        regNumber: initialData.regNumber || '',
        owner: initialData.owner?._id || (owners.length > 0 ? owners[0]._id : ''),
        route: initialData.route?._id || (routes.length > 0 ? routes[0]._id : ''),
        schedules: initialData.schedules?.length > 0 
          ? initialData.schedules 
          : [{ departureTime: '' }],
        isAvailable: initialData.isAvailable !== false
      });
    } else if (owners.length > 0 || routes.length > 0) {
      setFormData(prev => ({
        ...prev,
        owner: owners.length > 0 ? owners[0]._id : '',
        route: routes.length > 0 ? routes[0]._id : ''
      }));
    }
  }, [initialData, owners, routes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = (index, e) => {
    const { name, value } = e.target;
    const newSchedules = [...formData.schedules];
    newSchedules[index] = { ...newSchedules[index], [name]: value };
    setFormData(prev => ({ ...prev, schedules: newSchedules }));
  };

  const handleAddSchedule = () => {
    setFormData(prev => ({ 
      ...prev, 
      schedules: [...prev.schedules, { departureTime: '' }] 
    }));
  };

  const handleRemoveSchedule = (index) => {
    const newSchedules = formData.schedules.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, schedules: newSchedules }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty schedules
    const filteredSchedules = formData.schedules.filter(
      s => s.departureTime && s.departureTime.trim() !== ''
    );
    
    onSubmit({
      ...formData,
      schedules: filteredSchedules.length > 0 ? filteredSchedules : []
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <Select
        label="Owner"
        name="owner"
        options={owners.map(owner => ({ value: owner._id, label: owner.name }))}
        value={formData.owner}
        onChange={handleChange}
        required
      />

      <Select
        label="Route"
        name="route"
        options={routes.map(route => ({ value: route._id, label: route.name }))}
        value={formData.route}
        onChange={handleChange}
        required
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium">Schedules</label>
        {formData.schedules.map((schedule, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              type="time"
              name="departureTime"
              value={schedule.departureTime}
              onChange={(e) => handleScheduleChange(index, e)}
              required={index === 0}
            />
            {formData.schedules.length > 1 && (
              <Button
                type="button"
                size="sm"
                variant="danger"
                onClick={() => handleRemoveSchedule(index)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={handleAddSchedule}
        >
          Add Schedule
        </Button>
      </div>

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
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Bus' : 'Create Bus'}
        </Button>
      </div>
    </form>
  );
};

export default BusForm;