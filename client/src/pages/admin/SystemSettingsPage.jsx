import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import adminApi from '../../api/adminApi';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';

const SystemSettingsPage = () => {
  const { stats, fetchSystemStats } = useAdmin();
  const [formData, setFormData] = useState({
    maintenanceMode: false,
    newUserSignups: true,
    maxBusesPerOwner: 5,
    reviewApprovalRequired: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (stats?.settings) {
      setFormData(stats.settings);
    }
  }, [stats]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await adminApi.updateSystemSettings(formData);
      setSuccess('System settings updated successfully');
      fetchSystemStats();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">System Settings</h1>
      
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">General Settings</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="maintenanceMode" className="font-medium">
                Maintenance Mode
              </label>
              <p className="text-sm text-gray-500">
                When enabled, only administrators can access the system
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="maintenanceMode"
                name="maintenanceMode"
                checked={formData.maintenanceMode}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="newUserSignups" className="font-medium">
                Allow New User Signups
              </label>
              <p className="text-sm text-gray-500">
                Disable to prevent new users from registering
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="newUserSignups"
                name="newUserSignups"
                checked={formData.newUserSignups}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="reviewApprovalRequired" className="font-medium">
                Review Approval Required
              </label>
              <p className="text-sm text-gray-500">
                When enabled, new reviews require admin approval
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="reviewApprovalRequired"
                name="reviewApprovalRequired"
                checked={formData.reviewApprovalRequired}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Owner Settings</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="maxBusesPerOwner" className="font-medium">
                Maximum Buses per Owner
              </label>
              <p className="text-sm text-gray-500">
                Set the maximum number of buses a single owner can manage
              </p>
            </div>
            <input
              type="number"
              id="maxBusesPerOwner"
              name="maxBusesPerOwner"
              value={formData.maxBusesPerOwner}
              onChange={handleChange}
              min="1"
              max="50"
              className="w-24 p-2 border rounded"
            />
          </div>
        </div>
        
        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            variant="primary"
          >
            {loading ? <Loader size="small" /> : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SystemSettingsPage;