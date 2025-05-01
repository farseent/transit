import { useState, useEffect } from 'react';
import { Clock, Plus, Trash } from 'lucide-react';
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
  
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Bus name is required';
    }
    
    if (!formData.regNumber.trim()) {
      newErrors.regNumber = 'Registration number is required';
    }
    
    if (!formData.owner) {
      newErrors.owner = 'Owner is required';
    }
    
    if (!formData.route) {
      newErrors.route = 'Route is required';
    }
    
    const hasValidSchedule = formData.schedules.some(
      s => s.departureTime && s.departureTime.trim() !== ''
    );
    
    if (!hasValidSchedule) {
      newErrors.schedules = 'At least one valid schedule is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleScheduleChange = (index, e) => {
    const { name, value } = e.target;
    const newSchedules = [...formData.schedules];
    newSchedules[index] = { ...newSchedules[index], [name]: value };
    setFormData(prev => ({ ...prev, schedules: newSchedules }));
    
    // Clear schedule error when edited
    if (errors.schedules) {
      setErrors(prev => ({ ...prev, schedules: undefined }));
    }
  };

  const handleAddSchedule = () => {
    setFormData(prev => ({ 
      ...prev, 
      schedules: [...prev.schedules, { departureTime: '' }] 
    }));
  };

  const handleRemoveSchedule = (index) => {
    if (formData.schedules.length <= 1) {
      return; // Keep at least one schedule field
    }
    
    const newSchedules = formData.schedules.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, schedules: newSchedules }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label="Bus Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
        </div>
        
        <div>
          <Input
            label="Registration Number"
            name="regNumber"
            value={formData.regNumber}
            onChange={handleChange}
            error={errors.regNumber}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Select
            label="Owner"
            name="owner"
            options={owners.map(owner => ({ value: owner._id, label: owner.name }))}
            value={formData.owner}
            onChange={handleChange}
            error={errors.owner}
            required
            emptyOptionLabel={owners.length === 0 ? "No owners available" : "Select an owner"}
          />
        </div>
        
        <div>
          <Select
            label="Route"
            name="route"
            options={routes.map(route => ({ value: route._id, label: route.name }))}
            value={formData.route}
            onChange={handleChange}
            error={errors.route}
            required
            emptyOptionLabel={routes.length === 0 ? "No routes available" : "Select a route"}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Schedules</label>
          {errors.schedules && (
            <span className="text-red-500 text-xs">{errors.schedules}</span>
          )}
        </div>
        
        <div className="space-y-3">
          {formData.schedules.map((schedule, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock size={16} className="text-gray-400" />
                </div>
                <Input
                  type="time"
                  name="departureTime"
                  value={schedule.departureTime}
                  onChange={(e) => handleScheduleChange(index, e)}
                  required={index === 0}
                  className="pl-10"
                />
              </div>
              
              <Button
                type="button"
                size="sm"
                variant="danger"
                onClick={() => handleRemoveSchedule(index)}
                disabled={formData.schedules.length <= 1}
                className="flex items-center"
                aria-label="Remove schedule"
              >
                <Trash size={16} />
              </Button>
            </div>
          ))}
        </div>
        
        <Button
          type="button"
          variant="outline"
          onClick={handleAddSchedule}
          className="flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Schedule
        </Button>
      </div>

      <div className="flex items-center">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-900">Is Available</span>
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialData ? 'Update Bus' : 'Create Bus'}
        </Button>
      </div>
    </form>
  );
};

export default BusForm;