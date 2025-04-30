import React, { useState, useEffect } from 'react';
import Alert from '../../common/Alert';
import Button from '../../common/Button';
import Input from '../../common/Input';
import Select from '../../common/Select';

const RouteForm = ({ isEdit, initialData = {}, onSubmit, onCancel, stops }) => {
  // Initialize form data with proper default values
  const [formData, setFormData] = useState({
    name: '',
    stops: [],
    distances: [],
    times: [],
    fareRate: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize form data when component mounts or initialData changes
  useEffect(() => {
    if (initialData) {
      const processedStops = initialData.stops?.length > 0 
        ? initialData.stops.map(stop => 
            typeof stop === 'string' ? stop : stop.stopId?._id || stop._id || ''
          )
        : [];

      const processedDistances = initialData.distances?.length > 0
        ? initialData.distances
        : Array(processedStops.length).fill(0);

      const processedTimes = initialData.times?.length > 0
        ? initialData.times
        : Array(processedStops.length).fill(0);

      setFormData({
        name: initialData.name || '',
        stops: processedStops,
        distances: processedDistances,
        times: processedTimes,
        fareRate: initialData.fareRate || 0
      });
    }
  }, [initialData, isEdit]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
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
    if (stops.length === 0) return;
    
    setFormData(prev => ({
      ...prev,
      stops: [...prev.stops, stops[0]._id],
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
    
    // Validate that at least two stops are selected
    if (formData.stops.length < 2) {
      setError('At least two stops are required for a route');
      return;
    }
    
    // Validate that all stops are unique
    const uniqueStops = new Set(formData.stops);
    if (uniqueStops.size !== formData.stops.length) {
      setError('Duplicate stops are not allowed');
      return;
    }

    onSubmit(formData);
  };

  if (loading) return <div>Loading stops data...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      
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
          <div key={`stop-${index}`} className="border p-4 rounded-lg space-y-2">
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
              options={stops.map(stop => ({
                value: stop._id,
                label: `${stop.name} (${stop.code})`
              }))}
            />
            
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
          disabled={stops.length === 0}
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
        <Button 
          type="submit"
          disabled={formData.stops.length < 2}
        >
          {isEdit ? 'Update Route' : 'Create Route'}
        </Button>
      </div>
    </form>
  );
};

export default RouteForm;