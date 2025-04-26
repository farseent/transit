import React, { useState, useEffect } from 'react';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Input from '../../components/common/Input';
import adminApi from '../../../api/adminApi';

const RouteForm = ({ isEdit, initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    stops: initialData.stops || [],
    distances: initialData.distances || [],
    times: initialData.times || [],
    fareRate: initialData.fareRate || 0
  });
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStops = async () => {
      try {
        setLoading(true);
        const response = await adminApi.getStops();
        setStops(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch stops');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStops();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStopChange = (index, value) => {
    const updatedStops = [...formData.stops];
    updatedStops[index] = value;
    setFormData(prev => ({ ...prev, stops: updatedStops }));
  };

  const handleDistanceChange = (index, value) => {
    const updatedDistances = [...formData.distances];
    updatedDistances[index] = Number(value);
    setFormData(prev => ({ ...prev, distances: updatedDistances }));
  };

  const handleTimeChange = (index, value) => {
    const updatedTimes = [...formData.times];
    updatedTimes[index] = Number(value);
    setFormData(prev => ({ ...prev, times: updatedTimes }));
  };

  const addStop = () => {
    setFormData(prev => ({
      ...prev,
      stops: [...prev.stops, stops[0]?._id || ''],
      distances: [...prev.distances, 0],
      times: [...prev.times, 0]
    }));
  };

  const removeStop = (index) => {
    const updatedStops = [...formData.stops];
    const updatedDistances = [...formData.distances];
    const updatedTimes = [...formData.times];
    
    updatedStops.splice(index, 1);
    updatedDistances.splice(index, 1);
    updatedTimes.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      stops: updatedStops,
      distances: updatedDistances,
      times: updatedTimes
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (loading) return <div>Loading stops data...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}
      
      <Input
        label="Route Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      
      <Input
        label="Fare Rate (per km)"
        name="fareRate"
        type="number"
        step="0.01"
        min="0"
        value={formData.fareRate}
        onChange={handleChange}
        required
      />
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Route Stops</h3>
        
        {formData.stops.map((stopId, index) => (
          <div key={index} className="border p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Stop #{index + 1}</h4>
              {index > 0 && (
                <Button 
                  type="button" 
                  size="sm" 
                  variant="danger"
                  onClick={() => removeStop(index)}
                >
                  Remove
                </Button>
              )}
            </div>
            
            <Select
              label="Select Stop"
              value={stopId}
              onChange={(e) => handleStopChange(index, e.target.value)}
              required
            >
              <option value="">Select a stop</option>
              {stops.map(stop => (
                <option key={stop._id} value={stop._id}>
                  {stop.name} ({stop.code})
                </option>
              ))}
            </Select>
            
            {index > 0 && (
              <>
                <Input
                  label={`Distance from previous stop (km)`}
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.distances[index] || 0}
                  onChange={(e) => handleDistanceChange(index, e.target.value)}
                  required
                />
                
                <Input
                  label={`Time from previous stop (minutes)`}
                  type="number"
                  min="0"
                  value={formData.times[index] || 0}
                  onChange={(e) => handleTimeChange(index, e.target.value)}
                  required
                />
              </>
            )}
          </div>
        ))}
        
        <Button 
          type="button" 
          variant="outline"
          onClick={addStop}
        >
          Add Stop
        </Button>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? 'Update Route' : 'Create Route'}
        </Button>
      </div>
    </form>
  );
};

export default RouteForm;