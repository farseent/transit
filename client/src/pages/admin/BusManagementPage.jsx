import { useState, useEffect } from 'react';
import { Search, Plus, AlertCircle, Check } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
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
        limit: pagination.limit,
        search: searchTerm // Pass search term to API if implemented
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
      setLoading(true);
      const response = await adminApi.createBus(busData);
      setBuses([response.data, ...buses]);
      setSuccess('Bus created successfully');
      setTimeout(() => setSuccess(null), 3000);
      setShowForm(false);
      fetchBuses();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBus = async (busData) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBus = async (busId) => {
    if (window.confirm('Are you sure you want to delete this bus? This action cannot be undone.')) {
      try {
        setLoading(true);
        await adminApi.deleteBus(busId);
        setBuses(buses.filter(bus => bus._id !== busId));
        setSuccess('Bus deleted successfully');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete bus');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditBus = (bus) => {
    setCurrentBus(bus);
    setShowForm(true);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on search
    fetchBuses();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

    useEffect(() => {
      // Initial data fetch (runs once on mount)
      const fetchInitialData = async () => {
        await fetchBuses();
        await fetchOwners();
        await fetchRoutes();
      };
      
      fetchInitialData();
    }, []); // Empty dependency array for initial load only
  
    // Effect for pagination changes
    useEffect(() => {
      if (pagination.page !== 1 || searchTerm === '') {
        fetchBuses();
      }
    }, [pagination.page]); // Only run when page changes
    
    // Debounced search effect
    useEffect(() => {
      const timer = setTimeout(() => {
        if (searchTerm !== '') {
          // Reset to page 1 when searching
          setPagination(prev => ({ ...prev, page: 1 }));
        }
      }, 500);
    
      return () => clearTimeout(timer);
    }, [searchTerm]);
    
    // Separate effect to handle the actual search fetch
    useEffect(() => {
      if (pagination.page === 1 && searchTerm !== '') {
        fetchBuses();
      }
    }, [pagination.page, searchTerm]);
    
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="md:flex md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Bus Management</h1>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Button
            onClick={() => {
              setCurrentBus(null);
              setShowForm(true);
            }}
            variant="primary"
            className="flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add New Bus
          </Button>
        </div>
      </div>

      {error && 
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)} 
          icon={<AlertCircle size={20} />}
        />
      }
      
      {success && 
        <Alert 
          type="success" 
          message={success} 
          onClose={() => setSuccess(null)} 
          icon={<Check size={20} />}
        />
      }

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search buses..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Button type="submit" variant="secondary" className="whitespace-nowrap">
              Search
            </Button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : buses.length > 0 ? (
          <>
            <BusList 
              buses={buses}
              onEditBus={handleEditBus}
              onDeleteBus={handleDeleteBus}
            />
            {pagination.totalPages > 1 && (
              <div className="px-4 py-3 bg-white border-t border-gray-200">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 px-4">
            <p className="text-gray-500">No buses found. Create your first bus to get started.</p>
          </div>
        )}
      </div>

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