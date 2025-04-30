import React, { useState, useEffect } from 'react';
import Alert from '../../common/Alert';
import Button from '../../common/Button';
import Input from '../../common/Input';
import Table from '../../common/Table';
import Modal from '../../common/Modal';
import adminApi from '../../../api/adminApi';

const StopManager = () => {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentStop, setCurrentStop] = useState(null);
  const [stopForm, setStopForm] = useState({
    name: '',
    code: '',
    location: {
      type: 'Point',
      coordinates: [0, 0]
    }
  });

  useEffect(() => {
    fetchStops();
  }, []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStopForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCoordinateChange = (index, value) => {
    const updatedCoordinates = [...stopForm.location.coordinates];
    updatedCoordinates[index] = Number(value);
    setStopForm(prev => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: updatedCoordinates
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentStop) {
        // Update existing stop
        await adminApi.updateStop(currentStop._id, stopForm);
        setSuccess('Stop updated successfully');
      } else {
        // Create new stop
        await adminApi.createStop(stopForm);
        setSuccess('Stop created successfully');
      }
      setShowModal(false);
      fetchStops();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 
        (currentStop ? 'Failed to update stop' : 'Failed to create stop'));
    }
  };

  const handleEdit = (stop) => {
    setCurrentStop(stop);
    setStopForm({
      name: stop.name,
      code: stop.code,
      location: {
        type: stop.location.type,
        coordinates: [...stop.location.coordinates]
      }
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this stop?')) {
      try {
        await adminApi.deleteStop(id);
        setSuccess('Stop deleted successfully');
        fetchStops();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete stop');
      }
    }
  };

  const resetForm = () => {
    setCurrentStop(null);
    setStopForm({
      name: '',
      code: '',
      location: {
        type: 'Point',
        coordinates: [0, 0]
      }
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  if (loading) return <div>Loading stops...</div>;

  return (
    <div className="space-y-4">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Bus Stops</h2>
        <Button onClick={() => {
          resetForm();
          setShowModal(true);
        }}>
          Add New Stop
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header>Name</Table.Header>
              <Table.Header>Code</Table.Header>
              <Table.Header>Location</Table.Header>
              <Table.Header>Actions</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {stops.map((stop) => (
              <Table.Row key={stop._id}>
                <Table.Cell>{stop.name}</Table.Cell>
                <Table.Cell>{stop.code}</Table.Cell>
                <Table.Cell>
                  {stop.location.coordinates.join(', ')}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(stop)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="danger"
                      onClick={() => handleDelete(stop._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={handleModalClose}
        title={currentStop ? 'Edit Stop' : 'Add New Stop'}
      >
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Stop Name"
              name="name"
              value={stopForm.name}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Stop Code"
              name="code"
              value={stopForm.code}
              onChange={handleChange}
              required
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Coordinates</label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Longitude"
                  type="number"
                  step="any"
                  value={stopForm.location.coordinates[0]}
                  onChange={(e) => handleCoordinateChange(0, e.target.value)}
                  required
                />
                <Input
                  placeholder="Latitude"
                  type="number"
                  step="any"
                  value={stopForm.location.coordinates[1]}
                  onChange={(e) => handleCoordinateChange(1, e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <Button 
                type="button"
                variant="secondary" 
                onClick={handleModalClose}
              >
                Cancel
              </Button>
              <Button type="submit">
                {currentStop ? 'Update Stop' : 'Save Stop'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default StopManager;