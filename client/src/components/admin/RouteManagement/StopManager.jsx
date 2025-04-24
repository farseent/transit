import { useState } from 'react';
import Button from '../../common/Button';

const StopManager = ({ stops, onStopsChange }) => {
  const [newStop, setNewStop] = useState({ name: '', fareFromStart: 0 });

  const handleAddStop = () => {
    if (newStop.name.trim()) {
      onStopsChange([...stops, { ...newStop, fareFromStart: Number(newStop.fareFromStart) }]);
      setNewStop({ name: '', fareFromStart: 0 });
    }
  };

  const handleRemoveStop = (index) => {
    const updatedStops = [...stops];
    updatedStops.splice(index, 1);
    onStopsChange(updatedStops);
  };

  const handleStopChange = (index, field, value) => {
    const updatedStops = [...stops];
    updatedStops[index][field] = field === 'fareFromStart' ? Number(value) : value;
    onStopsChange(updatedStops);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Stop Name</label>
          <input
            type="text"
            value={newStop.name}
            onChange={(e) => setNewStop({ ...newStop, name: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Enter stop name"
          />
        </div>
        <div className="w-24">
          <label className="block text-sm font-medium mb-1">Fare ($)</label>
          <input
            type="number"
            value={newStop.fareFromStart}
            onChange={(e) => setNewStop({ ...newStop, fareFromStart: e.target.value })}
            className="w-full p-2 border rounded"
            min="0"
            step="0.01"
          />
        </div>
        <Button
          onClick={handleAddStop}
          size="sm"
          disabled={!newStop.name.trim()}
        >
          Add
        </Button>
      </div>

      {stops.length > 0 && (
        <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
          {stops.map((stop, index) => (
            <div key={index} className="p-3 flex items-center gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={stop.name}
                  onChange={(e) => handleStopChange(index, 'name', e.target.value)}
                  className="w-full p-1 border-b"
                />
              </div>
              <div className="w-20">
                <input
                  type="number"
                  value={stop.fareFromStart}
                  onChange={(e) => handleStopChange(index, 'fareFromStart', e.target.value)}
                  className="w-full p-1 border-b"
                  min="0"
                  step="0.01"
                />
              </div>
              <Button
                onClick={() => handleRemoveStop(index)}
                variant="danger"
                size="sm"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StopManager;