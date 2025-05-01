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
  const [shouldFetch, setShouldFetch] = useState(true);

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
      setShouldFetch(false);
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
      setLoading(true);
      await adminApi.createRoute(routeData);
      refreshData();
      setSuccess('Route created successfully');
      setTimeout(() => setSuccess(null), 3000);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRoute = async (routeData) => {
    try {
      setLoading(true);
      await adminApi.updateRoute(currentRoute._id, routeData);
      fetchRoutes();
      setSuccess('Route updated successfully');
      setTimeout(() => setSuccess(null), 3000);
      setShowForm(false);
      setCurrentRoute(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoute = async (id) => {
    if(window.confirm('Are you sure you want to delete this route?')){
      try {
        setLoading(true);
        await adminApi.deleteRoute(id);
        setRoutes(routes.filter(route => route._id !== id));
        setSuccess('Route deleted successfully');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditRoute = (route) => {
    setCurrentRoute(route);
    setShowForm(true);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    setShouldFetch(true);
  };

  const refreshData = () => {
    setShouldFetch(true);
  };

  useEffect(() => {
    if (activeTab === 'routes' && shouldFetch) {
      fetchRoutes();
      fetchStops();
    }
  }, [pagination.page, activeTab, shouldFetch]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="sm:flex sm:justify-between sm:items-center">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Route Management</h1>
        {activeTab === 'routes' && (
          <Button
            onClick={() => {
              setCurrentRoute(null);
              setShowForm(true);
            }}
            variant="primary"
            className="w-full sm:w-auto"
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
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : routes.length > 0 ? (
            <>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <RouteList 
                    routes={routes} 
                    onDelete={handleDeleteRoute}
                    onEdit={handleEditRoute}
                  />
                </div>
              </div>
              {pagination.totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
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
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No routes found</h3>
              <p className="mt-1 text-sm text-gray-500">Create your first route to get started.</p>
              <div className="mt-6">
                <Button
                  variant="primary"
                  onClick={() => {
                    setCurrentRoute(null);
                    setShowForm(true);
                  }}
                >
                  Add New Route
                </Button>
              </div>
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
          isEdit={!!currentRoute}
          onSubmit={currentRoute ? handleUpdateRoute : handleCreateRoute}
          onCancel={() => {
            setShowForm(false);
            setCurrentRoute(null);
          }}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default RouteManagementPage;