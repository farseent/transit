import React, { useState, useEffect } from 'react';
import Alert from '../../common/Alert';
import Button from '../../common/Button';
import Input from '../../common/Input';
import Table from '../../common/Table';
import Modal from '../../common/Modal';
import adminApi from '../../../api/adminApi';
import { Edit, Trash }  from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [processingAction, setProcessingAction] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

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
      setProcessingAction(true);
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
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 
        (currentStop ? 'Failed to update stop' : 'Failed to create stop'));
    } finally {
      setProcessingAction(false);
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
        setProcessingAction(true);
        await adminApi.deleteStop(id);
        setSuccess('Stop deleted successfully');
        fetchStops();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete stop');
      } finally {
        setProcessingAction(false);
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

  const toggleDropdown = (stopId) => {
    setOpenDropdown(openDropdown === stopId ? null : stopId);
  };

  const filteredStops = stops.filter(stop => 
    stop.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    stop.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      
      <div className="sm:flex sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <h2 className="text-xl font-semibold">Bus Stops</h2>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <Input
              type="text"
              placeholder="Search stops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="w-full sm:w-auto"
          >
            Add New Stop
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredStops.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header>Name</Table.Header>
                  <Table.Header>Code</Table.Header>
                  <Table.Header>Location</Table.Header>
                  <Table.Header className="text-right">Actions</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {filteredStops.map((stop) => (
                  <Table.Row key={stop._id}>
                    <Table.Cell className="font-medium">{stop.name}</Table.Cell>
                    <Table.Cell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {stop.code}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">
                          {stop.location.coordinates.map(coord => coord.toFixed(6)).join(', ')}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      <div className="w-full justify-end">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEdit(stop)}
                            className="hidden sm:inline-flex"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="danger"
                            onClick={() => handleDelete(stop._id)}
                            className="hidden sm:inline-flex"
                          >
                            <Trash size={16} />
                          </Button>
                          {/* Improved dropdown for mobile */}
                          <div className="sm:hidden relative inline-block text-left">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="inline-flex items-center"
                              onClick={() => toggleDropdown(stop._id)}
                            >
                              Actions
                              <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </Button>
                            {openDropdown === stop._id && (
                              <div className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1" role="menu">
                                  <button 
                                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                    onClick={() => {
                                      handleEdit(stop);
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
                                    onClick={() => {
                                      handleDelete(stop._id);
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm ? 'No stops found matching your search' : 'No stops found'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try a different search term or clear the search' : 'Create your first stop to get started'}
          </p>
          {searchTerm ? (
            <div className="mt-6">
              <Button
                variant="outline"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="mt-6">
              <Button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
              >
                Add New Stop
              </Button>
            </div>
          )}
        </div>
      )}

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
              placeholder="Enter stop name"
            />
            
            <Input
              label="Stop Code"
              name="code"
              value={stopForm.code}
              onChange={handleChange}
              required
              placeholder="Enter unique code"
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Location Coordinates</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                  <Input
                    type="number"
                    step="any"
                    value={stopForm.location.coordinates[0]}
                    onChange={(e) => handleCoordinateChange(0, e.target.value)}
                    required
                    placeholder="e.g. -73.935242"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                  <Input
                    type="number"
                    step="any"
                    value={stopForm.location.coordinates[1]}
                    onChange={(e) => handleCoordinateChange(1, e.target.value)}
                    required
                    placeholder="e.g. 40.730610"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter the exact GPS coordinates for this bus stop
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0 mt-6">
              <Button 
                type="button"
                variant="secondary" 
                onClick={handleModalClose}
                disabled={processingAction}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={processingAction}
                className="w-full sm:w-auto flex items-center justify-center"
              >
                {processingAction ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>{currentStop ? 'Update Stop' : 'Save Stop'}</>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default StopManager;