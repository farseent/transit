import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import RouteList from '../../components/admin/RouteManagement/RouteList';
import RouteForm from '../../components/admin/RouteManagement/RouteForm';
import StopManager from '../../components/admin/RouteManagement/StopManager';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Tabs from '../../components/common/Tabs';
import Pagination from '../../components/common/Pagination';


const RouteManagementPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const [activeTab, setActiveTab] = useState('routes');
  const navigate = useNavigate();

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getRoutes({
        page: pagination.page,
        limit: pagination.limit
      });
      setRoutes(response.data);
      setPagination(prev => ({
        ...prev,
        totalPages: response.totalPages
      }));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoute = async (routeData) => {
    try {
      const newRoute = await adminApi.createRoute(routeData);
      setRoutes([newRoute, ...routes]);
      setSuccess('Route created successfully');
      setTimeout(() => setSuccess(null), 3000);
      navigate('/admin/routes');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleUpdateRoute = async (id, routeData) => {
    try {
      const updatedRoute = await adminApi.updateRoute(id, routeData);
      setRoutes(routes.map(route => 
        route._id === id ? updatedRoute : route
      ));
      setSuccess('Route updated successfully');
      setTimeout(() => setSuccess(null), 3000);
      navigate('/admin/routes');
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

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  useEffect(() => {
    if (activeTab === 'routes') {
      fetchRoutes();
    }
  }, [pagination.page, activeTab]);

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Route Management</h1>
          {activeTab === 'routes' && (
            <Button
              onClick={() => navigate('/admin/routes/add')}
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

            <Routes>
              <Route 
                path="add" 
                element={
                  <RouteForm 
                    onSubmit={handleCreateRoute} 
                    onCancel={() => navigate('/admin/routes')}
                  />
                } 
              />
              <Route 
                path="edit/:id" 
                element={
                  <RouteForm 
                    isEdit 
                    onSubmit={handleUpdateRoute} 
                    onCancel={() => navigate('/admin/routes')}
                  />
                } 
              />
            </Routes>
          </>
        ) : (
          <StopManager />
        )}
      </div>
  );
};

export default RouteManagementPage;