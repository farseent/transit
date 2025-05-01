import React, { useState, useEffect } from 'react';
import Alert from '../../common/Alert';
import Button from '../../common/Button';
import Input from '../../common/Input';
import Select from '../../common/Select';

const RouteForm = ({ isEdit, initialData = {}, onSubmit, onCancel, stops, loading }) => {
  // Initialize form data with proper default values
  const [formData, setFormData] = useState({
    name: '',
    stops: [],
    distances: [],
    times: [],
    fareRate: 0
  });

  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(0);

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
    
    // Auto-scroll to the new stop
    setTimeout(() => {
      setActiveSection(formData.stops.length);
    }, 100);
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
    
    if (activeSection >= index && activeSection > 0) {
      setActiveSection(activeSection - 1);
    }
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

  const toggleSection = (index) => {
    setActiveSection(activeSection === index ? -1 : index);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Route Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Route Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter route name"
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
            placeholder="0.00"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Route Stops</h3>
          <span className="text-sm text-gray-500">
            {formData.stops.length} stop{formData.stops.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="space-y-4 max-h-96 overflow-y-auto p-1">
          {formData.stops.map((stopId, index) => (
            <div 
              key={`stop-${index}`} 
              className={`border rounded-lg overflow-hidden ${activeSection === index ? 'border-blue-500 shadow-md' : 'border-gray-200'}`}
            >
              <div 
                className={`flex justify-between items-center p-4 cursor-pointer ${activeSection === index ? 'bg-blue-50' : 'bg-gray-50'}`}
                onClick={() => toggleSection(index)}
              >
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full mr-3 text-xs font-medium">
                    {index + 1}
                  </div>
                  <h4 className="font-medium">
                    {stops.find(stop => stop._id === stopId)?.name || 'Select a stop'}
                  </h4>
                </div>
                <div className="flex items-center">
                  {index > 0 && (
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeStop(index);
                      }}
                      className="mr-2"
                    >
                      Remove
                    </Button>
                  )}
                  <svg
                    className={`h-5 w-5 transform transition-transform ${activeSection === index ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              
              {activeSection === index && (
                <div className="p-4 bg-white space-y-4">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <Button 
          type="button" 
          variant="outline"
          onClick={addStop}
          disabled={stops.length === 0}
          className="w-full flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Stop
        </Button>
      </div>
      
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
        <Button 
          type="button" 
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={formData.stops.length < 2 || loading}
          className="w-full sm:w-auto flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>{isEdit ? 'Update Route' : 'Create Route'}</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default RouteForm;