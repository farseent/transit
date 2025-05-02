// src/pages/owner/OwnerBusDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ownerApi from '../../api/ownerApi';
import OwnerBusInfo from '../../components/owner/OwnerBusInfo';
import OwnerReviewList from '../../components/owner/OwnerReviewList';
import OwnerBusHeader from '../../components/owner/OwnerBusHeader';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';

const OwnerBusDetailPage = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        setLoading(true);
        const response = await ownerApi.getOwnerBusDetails(busId);
        setBus(response.data);
      } catch (err) {
        setError({ type: 'error', message: err.message || 'Failed to fetch bus details' });
        setAlertVisible(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBusDetails();
  }, [busId]);

  useEffect(() => {
    if (bus && activeTab === 'reviews') {
      fetchReviews();
    }
  }, [bus, activeTab]);

  // Auto-hide success alerts after 3 seconds
  useEffect(() => {
    if (error?.type === 'success' && alertVisible) {
      const timer = setTimeout(() => {
        setAlertVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, alertVisible]);

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const data = await ownerApi.getBusReviews(busId);
      setReviews(data);
    } catch (err) {
      setError({ type: 'error', message: err.message || 'Failed to fetch reviews' });
      setAlertVisible(true);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      setLoading(true);
      const updatedBus = await ownerApi.toggleBusAvailability(busId);
      setBus(updatedBus);
      setError({ type: 'success', message: 'Availability status updated successfully!' });
      setAlertVisible(true);
    } catch (err) {
      setError({ type: 'error', message: err.message || 'Failed to update availability' });
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !bus) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  if (!bus) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Alert type="error" message="Bus not found" />
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <OwnerBusHeader 
        bus={bus} 
        onBack={() => navigate(-1)} 
        onToggleAvailability={handleToggleAvailability} 
      />

      <div className="container mx-auto px-4 sm:px-6">
        {error && alertVisible && (
          <div className="mt-4 mb-2">
            <Alert 
              type={error.type || "error"} 
              message={error.message} 
              onClose={() => setAlertVisible(false)}
            />
          </div>
        )}

        {/* Tabs - Desktop and Mobile */}
        <div className="flex border-b border-gray-200 mb-6 mt-6 overflow-x-auto hide-scrollbar">
          <button
            className={`py-3 px-4 font-medium whitespace-nowrap transition duration-200 ${activeTab === 'details' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('details')}
            aria-selected={activeTab === 'details'}
            role="tab"
          >
            Bus Details
          </button>
          <button
            className={`py-3 px-4 font-medium whitespace-nowrap transition duration-200 ${activeTab === 'reviews' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('reviews')}
            aria-selected={activeTab === 'reviews'}
            role="tab"
          >
            Reviews & Ratings
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          {activeTab === 'details' && (
            <OwnerBusInfo bus={bus} />
          )}

          {activeTab === 'reviews' && (
            <div className="mt-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-0">Customer Reviews</h3>
                <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full self-start sm:self-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium text-blue-700">
                    Overall: {bus.ratings?.overall?.toFixed(1) || '0.0'} 
                    <span className="text-sm ml-1">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
                  </span>
                </div>
              </div>

              {reviewsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader />
                </div>
              ) : (
                <OwnerReviewList reviews={reviews} />
              )}

              {reviews.length > 5 && (
                <div className="mt-6 flex justify-center">
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition duration-200 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to top
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerBusDetailPage;