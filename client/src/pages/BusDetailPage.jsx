import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Star, AlertCircle, X, MessageSquare } from 'lucide-react';
import busApi from '../api/busApi';
import { addReview } from '../api/reviewApi';
import { addComplaint } from '../api/complaintApi';
import { useAuth } from '../context/AuthContext';

import BusInfo from '../components/busDetails/BusInfo';
import ReviewList from '../components/busDetails/ReviewList';
import ReviewForm from '../components/busDetails/ReviewForm';
import ComplaintForm from '../components/busDetails/ComplaintForm';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';

const BusDetailPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const routeId = searchParams.get('routeId');
  const fromStopId = searchParams.get('fromStopId');
  const toStopId = searchParams.get('toStopId');
  const navigate = useNavigate();
  
  const { isAuthenticated } = useAuth();
  const [bus, setBus] = useState(null);
  const [fromStop,setFromStop ] = useState(null);
  const [toStop,setToStop ] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showComplaintForm, setShowComplaintForm] = useState(false);

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        setLoading(true);
        const busData = await busApi.fetchBusDetails(id, routeId, fromStopId, toStopId);
        setBus(busData.bus);
        setReviews(busData.reviews || []);
        setFromStop(busData.fromStop);
        setToStop(busData.toStop);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bus details:', err);
        setError('Failed to load bus details');
        setLoading(false);
      }
    };

    if (id && routeId && fromStopId && toStopId) {
      fetchBusDetails();
    } else {
      setError('Missing required information to fetch bus details.');
      setLoading(false);
    }
  }, [id, routeId, fromStopId, toStopId]);

  const handleAddReview = async (reviewData) => {
    try {
      // reviewData now has the correct structure with ratings: {cleanliness, punctuality, etc.}
      const response = await addReview(id, reviewData);
      setReviews([...reviews, response]);
      setShowReviewForm(false);
      setAlert({ type: 'success', message: 'Review submitted successfully!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Failed to submit review' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleAddComplaint = async (complaintData) => {
    try {
      await addComplaint(id, complaintData);
      setShowComplaintForm(false);
      setAlert({ type: 'success', message: 'Your complaint has been submitted successfully! We will review it shortly.' });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to submit complaint. Please try again.' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleReviewButtonClick = () => {
    if (isAuthenticated) {
      setShowReviewForm(!showReviewForm);
      setShowComplaintForm(false); // Close complaint form if open
    } else {
      setAlert({ type: 'warning', message: 'Please login to add a review' });
      setTimeout(() => {
        setAlert(null);
        navigate('/login', { state: { from: `/bus/${id}` } });
      }, 2000);
    }
  };

  const handleComplaintButtonClick = () => {
    if (isAuthenticated) {
      setShowComplaintForm(!showComplaintForm);
      setShowReviewForm(false); // Close review form if open
    } else {
      setAlert({ type: 'warning', message: 'Please login to report a complaint' });
      setTimeout(() => {
        setAlert(null);
        navigate('/login', { state: { from: `/bus/${id}` } });
      }, 2000);
    }
  };

  if (loading) return <Loader />;
  if (error) return <Alert type="danger" message={error} />;
  if (!bus) return <Alert type="warning" message="Bus not found" />;

  return (
    <div className="container mx-auto px-4 py-8">
      {alert && <Alert type={alert.type} message={alert.message} />}
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Bus Information Section */}
        <div>
          <BusInfo bus={bus} fromStop={fromStop} toStop={toStop} />
        </div>

        {/* Reviews Section */}
        <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              <span className="flex items-center gap-2">
                <MessageSquare size={20} className="text-blue-600" />
                Reviews
              </span>
            </h2>
            
            <button 
              onClick={handleReviewButtonClick}
              className={`flex items-center gap-2 rounded-md px-4 py-2 font-medium text-sm transition-all duration-200 ${
                showReviewForm 
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {showReviewForm ? (
                <>
                  <X size={16} />
                  Cancel
                </>
              ) : (
                <>
                  <Star size={16} />
                  Add Review
                </>
              )}
            </button>
          </div>

          {showReviewForm && isAuthenticated && (
            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
              <ReviewForm 
                onSubmit={handleAddReview} 
                onCancel={() => setShowReviewForm(false)} 
              />
            </div>
          )}

          <ReviewList reviews={reviews} />

          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="flex justify-end">
              <button 
                onClick={handleComplaintButtonClick}
                className={`flex items-center gap-2 rounded-md px-4 py-2 font-medium text-sm transition-all duration-200 ${
                  showComplaintForm 
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {showComplaintForm ? (
                  <>
                    <X size={16} />
                    Cancel
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} />
                    Report Complaint
                  </>
                )}
              </button>
            </div>

            {showComplaintForm && isAuthenticated && (
              <div className="bg-white rounded-lg p-4 mt-4 shadow-sm border border-gray-200">
                <ComplaintForm 
                  onSubmit={handleAddComplaint} 
                  onCancel={() => setShowComplaintForm(false)} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusDetailPage;