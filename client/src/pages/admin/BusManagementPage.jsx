import { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';
import BusList from '../../components/admin/BusManagment/BusList';
import BusForm from '../../components/admin/BusManagment/BusForm';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';

const BusManagementPage = () => {
  const [buses, setBuses] = useState([]);
  const [owners, setOwners] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentBus, setCurrentBus] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1
  });

  const fetchBuses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getBusesPaginated({
        page: pagination.page,
        limit: pagination.limit
      });
      setBuses(response.data.buses || []);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.totalPages || 1
      }));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOwners = async () => {
    try {
      const response = await adminApi.getOwners();
      setOwners(response.data);
    } catch (err) {
      console.error('Failed to fetch owners:', err);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await adminApi.getRoutes();
      setRoutes(response.data);
    } catch (err) {
      console.log('Failed to fetch routes:', err);
    }
  };

  const handleCreateBus = async (busData) => {
    try {
      const response = await adminApi.createBus(busData);
      setBuses([response.data, ...buses]);
      setSuccess('Bus created successfully');
      setTimeout(() => setSuccess(null), 3000);
      setShowForm(false);
      fetchBuses();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleUpdateBus = async (busData) => {
    try {
      const response = await adminApi.updateBus(currentBus._id, busData);
      setBuses(buses.map(bus => 
        bus._id === currentBus._id ? response.data : bus
      ));
      setSuccess('Bus updated successfully');
      setTimeout(() => setSuccess(null), 3000);
      setShowForm(false);
      setCurrentBus(null);
      fetchBuses();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteBus = async (busId) => {
    if (window.confirm('Are you sure you want to delete this bus? This action cannot be undone.')) {
      try {
        await adminApi.deleteBus(busId);
        setBuses(buses.filter(bus => bus._id !== busId));
        setSuccess('Bus deleted successfully');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete bus');
      }
    }
  };

  // const handleAssignOwner = async (busId, ownerId) => {
  //   try {
  //     await adminApi.assignBusToOwner(busId, ownerId);
  //     setBuses(buses.map(bus => 
  //       bus._id === busId ? { ...bus, owner: ownerId } : bus
  //     ));
  //     setSuccess('Bus owner assigned successfully');
  //     setTimeout(() => setSuccess(null), 3000);
  //   } catch (err) {
  //     setError(err.response?.data?.message || err.message);
  //   }
  // };


//Assignroute  
  // const handleAssignRoute = async (busId, routeId) => {
  //   try {
  //     await adminApi.assignBusToRoute(busId, routeId);
  //     const assignedRoute = routes.find(route => route._id === routeId);
  //     setBuses(buses.map(bus => 
  //       bus._id === busId ? { ...bus, route: assignedRoute } : bus
  //     ));
  //     setSuccess('Bus route assigned successfully');
  //     setTimeout(() => setSuccess(null), 3000);
  //   } catch (err) {
  //     setError(err.response?.data?.message || err.message);
  //   }
  // };

  const handleEditBus = (bus) => {
    setCurrentBus(bus);
    setShowForm(true);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  useEffect(() => {
    fetchBuses();
    fetchOwners();
    fetchRoutes();
  }, [pagination.page]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bus Management</h1>
        <Button
          onClick={() => {
            setCurrentBus(null);
            setShowForm(true);
          }}
          variant="primary"
        >
          Add New Bus
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      ) : buses.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <BusList 
              buses={buses}
              onEditBus={handleEditBus}
              onDeleteBus={handleDeleteBus}
            />
          </div>
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No buses found. Create your first bus to get started.
        </div>
      )}

      <Modal 
        isOpen={showForm} 
        onClose={() => {
          setShowForm(false);
          setCurrentBus(null);
        }}
        title={currentBus ? 'Edit Bus' : 'Add New Bus'}
        size="lg"
      >
        <BusForm 
          initialData={currentBus}
          onSubmit={currentBus ? handleUpdateBus : handleCreateBus}
          onCancel={() => {
            setShowForm(false);
            setCurrentBus(null);
          }}
          owners={owners}
          routes={routes}
        />
      </Modal>
    </div>
  );
};

export default BusManagementPage;