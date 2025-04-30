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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1
  });

  const fetchBuses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getBuses({
        page: pagination.page,
        limit: pagination.limit
      });
      // console.log('data received in busManagementpage =', response);
  
      const buses = response.data; // <- correct path
      if (Array.isArray(buses)) {
        setBuses(buses);
      } else {
        setBuses([]);
      }
  
      // totalPages is probably not available in this structure, so default it
      setPagination(prev => ({
        ...prev,
        totalPages: 1 // You can update this if your backend provides it elsewhere
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
      // console.log('owners response:', response); // Check what's inside
      setOwners(response.data); // Assuming response.data is the array
    } catch (err) {
      console.error('Failed to fetch owners:', err);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await adminApi.getRoutes();
      setRoutes(response.data)
    } catch (err) {
      console.log('Failed to fetch routes:',err);
    }
  }
  
  const handleCreateBus = async (busData) => {
    try {
      const newBus = await adminApi.createBus(busData);
      setBuses([newBus, ...buses]);
      setSuccess('Bus created successfully');
      setTimeout(() => setSuccess(null), 3000);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleAssignOwner = async (busId, ownerId) => {
    try {
      await adminApi.assignBusToOwner(busId, ownerId);
      fetchBuses();
      setBuses(buses.map(bus => 
        bus._id === busId ? { ...bus, owner: ownerId } : bus
      ));
      setSuccess('Bus owner assigned successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleAssignRoute = async (busId, routeId) => {
    try {
      await adminApi.assignBusToRoute(busId, routeId);
      fetchBuses();
      const assignedRoute = routes.find(route => route._id === routeId);
      setBuses(buses.map(bus => 
        bus._id === busId ? { ...bus, route: assignedRoute } : bus
      ));
      setSuccess('Bus route assigned successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
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
          onClick={() => setShowForm(true)}
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
              owners={owners}
              routes={routes}
              onAssignOwner={handleAssignOwner}
              onAssignRoute={handleAssignRoute}
            />
          </div>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No buses found. Create your first bus to get started.
        </div>
      )}

      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)}
        title="Add New Bus"
      >
        <BusForm 
          onSubmit={handleCreateBus} 
          onCancel={() => setShowForm(false)}
          owners={owners}  // Pass owners as a prop
          routes={routes}  // Pass routes as a prop
        />
      </Modal>
    </div>
  );
};

export default BusManagementPage;