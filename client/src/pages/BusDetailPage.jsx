import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Star, AlertCircle, X, MessageSquare, ChevronLeft } from 'lucide-react';
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
  const arrivalTime = searchParams.get('arrivalTime');
  const navigate = useNavigate();
  
  const { isAuthenticated } = useAuth();
  const [bus, setBus] = useState(null);
  const [fromStop, setFromStop] = useState(null);
  const [toStop, setToStop] = useState(null);
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
        const busData = await busApi.fetchBusDetails(id, routeId, fromStopId, toStopId, arrivalTime);
        setBus(busData.bus);
        setReviews(busData.reviews || []);
        setFromStop(busData.fromStop);
        setToStop(busData.toStop);
        setLoading(false);
        console.log('search results received in the bus detail page =', busData);

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

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) return <Loader />;
  if (error) return <Alert type="danger" message={error} />;
  if (!bus) return <Alert type="warning" message="Bus not found" />;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {alert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <Alert type={alert.type} message={alert.message} />
        </div>
      )}
      
      {/* Back button */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <button 
          onClick={handleBackClick}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-4 transition-colors"
        >
          <ChevronLeft size={18} />
          <span>Back to search results</span>
        </button>
      </div>
      
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4">
        {/* Bus Details Card */}
        <div className="bg-white rounded-lg shadow-card overflow-hidden mb-6">
          <div className="bg-primary-600 text-white p-4">
            <h1 className="text-2xl font-bold">{bus.name}</h1>
            <p className="text-primary-100">{bus.route?.name} Route</p>
          </div>
          
          <div className="p-6">
            <BusInfo bus={bus} fromStop={fromStop} toStop={toStop} />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button 
            onClick={handleReviewButtonClick}
            className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-3 font-medium transition-all duration-200 ${
              showReviewForm 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
          >
            {showReviewForm ? (
              <>
                <X size={16} />
                Cancel Review
              </>
            ) : (
              <>
                <Star size={16} />
                Add Review
              </>
            )}
          </button>
          
          <button 
            onClick={handleComplaintButtonClick}
            className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-3 font-medium transition-all duration-200 ${
              showComplaintForm 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                : 'bg-danger text-white hover:bg-red-500'
            }`}
          >
            {showComplaintForm ? (
              <>
                <X size={16} />
                Cancel Complaint
              </>
            ) : (
              <>
                <AlertCircle size={16} />
                Report Complaint
              </>
            )}
          </button>
        </div>
        
        {/* Form Sections */}
        {showReviewForm && isAuthenticated && (
          <div className="bg-white rounded-lg shadow-card p-6 mb-6 border-l-4 border-primary-500">
            <h3 className="text-lg font-semibold mb-4 text-primary-600">Add Your Review</h3>
            <ReviewForm 
              onSubmit={handleAddReview} 
              onCancel={() => setShowReviewForm(false)} 
            />
          </div>
        )}
        
        {showComplaintForm && isAuthenticated && (
          <div className="bg-white rounded-lg shadow-card p-6 mb-6 border-l-4 border-danger">
            <h3 className="text-lg font-semibold mb-4 text-danger">Submit a Complaint</h3>
            <ComplaintForm 
              onSubmit={handleAddComplaint} 
              onCancel={() => setShowComplaintForm(false)} 
            />
          </div>
        )}
        
        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <div className="bg-gray-100 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare size={20} className="text-primary-600" />
              Reviews & Feedback
            </h2>
            <div className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </div>
          </div>

          <div className="p-6">
            {reviews.length > 0 ? (
              <ReviewList reviews={reviews} />
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p className="mb-4">No reviews yet for this bus.</p>
                <p>Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusDetailPage;