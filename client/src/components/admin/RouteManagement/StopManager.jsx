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
  const [showModal, setShowModal] = useState(false);
  const [newStop, setNewStop] = useState({
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
    setNewStop(prev => ({ ...prev, [name]: value }));
  };

  const handleCoordinateChange = (index, value) => {
    const updatedCoordinates = [...newStop.location.coordinates];
    updatedCoordinates[index] = Number(value);
    setNewStop(prev => ({
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
      await adminApi.createStop(newStop);
      setShowModal(false);
      fetchStops();
      setNewStop({
        name: '',
        code: '',
        location: {
          type: 'Point',
          coordinates: [0, 0]
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create stop');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this stop?')) {
      try {
        await adminApi.deleteStop(id);
        fetchStops();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete stop');
      }
    }
  };

  if (loading) return <div>Loading stops...</div>;

  return (
    <div className="space-y-4">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Bus Stops</h2>
        <Button onClick={() => setShowModal(true)}>Add New Stop</Button>
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
                  <Button 
                    size="sm" 
                    variant="danger"
                    onClick={() => handleDelete(stop._id)}
                  >
                    Delete
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Add New Stop</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Stop Name"
              name="name"
              value={newStop.name}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Stop Code"
              name="code"
              value={newStop.code}
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
                  value={newStop.location.coordinates[0]}
                  onChange={(e) => handleCoordinateChange(0, e.target.value)}
                  required
                />
                <Input
                  placeholder="Latitude"
                  type="number"
                  step="any"
                  value={newStop.location.coordinates[1]}
                  onChange={(e) => handleCoordinateChange(1, e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Stop
              </Button>
            </div>
          </form>
        </div>
      </Modal>

    </div>
  );
};

export default StopManager;