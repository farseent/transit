import { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';
import RouteList from '../../components/admin/RouteManagement/RouteList';
import RouteForm from '../../components/admin/RouteManagement/RouteForm';
import StopManager from '../../components/admin/RouteManagement/StopManager';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Tabs from '../../components/common/Tabs';
import Pagination from '../../components/common/Pagination';

const RouteManagementPage = () => {
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const [activeTab, setActiveTab] = useState('routes');

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getRoutesPaginated({
        page: pagination.page,
        limit: pagination.limit
      });
      setRoutes(response.data.routes || []);
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

  const fetchStops = async () => {
    try {
      const response = await adminApi.getStops();
      setStops(response.data || []);
    } catch (err) {
      console.error('Failed to fetch stops:', err);
    }
  };

  const handleCreateRoute = async (routeData) => {
    try {
      const newRoute = await adminApi.createRoute(routeData);
      setRoutes([newRoute, ...routes]);
      setSuccess('Route created successfully');
      setTimeout(() => setSuccess(null), 3000);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleUpdateRoute = async (routeData) => {
    try {
      const updatedRoute = await adminApi.updateRoute(currentRoute._id, routeData);
      setRoutes(routes.map(route => 
        route._id === currentRoute._id ? updatedRoute : route
      ));
      setSuccess('Route updated successfully');
      setTimeout(() => setSuccess(null), 3000);
      setShowForm(false);
      setCurrentRoute(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteRoute = async (id) => {
    try {
      await adminApi.deleteRoute(id);
      setRoutes(routes.filter(route => route._id !== id));
      setSuccess('Route deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleEditRoute = (route) => {
    setCurrentRoute(route);
    setShowForm(true);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  useEffect(() => {
    if (activeTab === 'routes') {
      fetchRoutes();
      fetchStops();
    }
  }, [pagination.page, activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Route Management</h1>
        {activeTab === 'routes' && (
          <Button
            onClick={() => {
              setCurrentRoute(null);
              setShowForm(true);
            }}
            variant="primary"
          >
            Add New Route
          </Button>
        )}
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <Tabs
        tabs={[
          { id: 'routes', label: 'Routes' },
          { id: 'stops', label: 'Stops Management' }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'routes' ? (
        <>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader />
            </div>
          ) : routes.length > 0 ? (
            <>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <RouteList 
                  routes={routes} 
                  onDelete={handleDeleteRoute}
                  onEdit={handleEditRoute}
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
              No routes found. Create your first route to get started.
            </div>
          )}
        </>
      ) : (
        <StopManager />
      )}

      <Modal 
        isOpen={showForm} 
        onClose={() => {
          setShowForm(false);
          setCurrentRoute(null);
        }}
        title={currentRoute ? 'Edit Route' : 'Add New Route'}
        size="lg"
      >
        <RouteForm 
          initialData={currentRoute}
          stops={stops}
          onSubmit={currentRoute ? handleUpdateRoute : handleCreateRoute}
          onCancel={() => {
            setShowForm(false);
            setCurrentRoute(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default RouteManagementPage;