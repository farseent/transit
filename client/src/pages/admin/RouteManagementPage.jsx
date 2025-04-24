import { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';
import RouteList from '../../components/admin/RouteManagement/RouteList';
import RouteForm from '../../components/admin/RouteManagement/RouteForm';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';

const RouteManagementPage = () => {
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

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getRoutes({
        page: pagination.page,
        limit: pagination.limit
      });
      setRoutes(data.routes);
      setPagination(prev => ({
        ...prev,
        totalPages: data.totalPages
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
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  useEffect(() => {
    fetchRoutes();
  }, [pagination.page]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Route Management</h1>
        <Button
          onClick={() => setShowForm(true)}
          variant="primary"
        >
          Add New Route
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      ) : routes.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <RouteList routes={routes} />
          </div>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No routes found. Create your first route to get started.
        </div>
      )}

      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)}
        title="Create New Route"
        size="lg"
      >
        <RouteForm 
          onSubmit={handleCreateRoute} 
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  );
};

export default RouteManagementPage;