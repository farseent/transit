import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Star, AlertCircle, X, MessageSquare, ChevronLeft } from 'lucide-react';
import busApi from '../api/busApi';
import { addReview, updateReview, deleteReview } from '../api/reviewApi';
import { addComplaint } from '../api/complaintApi';
import { useAuth } from '../context/AuthContext';

import BusInfo from '../components/busDetails/BusInfo';
import ReviewList from '../components/busDetails/ReviewList';
import ReviewForm from '../components/busDetails/ReviewForm';
import ComplaintForm from '../components/busDetails/ComplaintForm';
import DeleteConfirmationModal from '../components/common/DeleteConformationModal';
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
  
  const { isAuthenticated, user } = useAuth();
  const [bus, setBus] = useState(null);
  const [fromStop, setFromStop] = useState(null);
  const [toStop, setToStop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  
  // New state for editing reviews
  const [editingReview, setEditingReview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  
  // Check if user has already reviewed this bus
  const userReview = isAuthenticated 
    ? reviews.find(review => review.user?._id === user?.id) 
    : null;

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

  // New function to handle editing reviews
  const handleEditReview = async (reviewData) => {
    try {
      const response = await updateReview(reviewData._id, reviewData);
      // Update the review in the local state
      const updatedReviews = reviews.map(review => 
        review._id === reviewData._id ? response : review
      );
      setReviews(updatedReviews);
      setEditingReview(null);
      setAlert({ type: 'success', message: 'Review updated successfully!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Failed to update review' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  // Function to handle deleting reviews
  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      // Remove the review from the local state
      const updatedReviews = reviews.filter(review => review._id !== reviewId);
      setReviews(updatedReviews);
      setShowDeleteModal(false);
      setReviewToDelete(null);
      setAlert({ type: 'success', message: 'Review deleted successfully!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Failed to delete review' });
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
      // If user has already reviewed and is not editing, let them edit
      if (userReview && !editingReview) {
        setEditingReview(userReview);
      } else {
        setShowReviewForm(!showReviewForm);
        setEditingReview(null);
      }
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
      setEditingReview(null); // Cancel any editing
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

  // Handler for edit button click in the review list
  const handleEditClick = (review) => {
    setEditingReview(review);
    setShowReviewForm(false);
    setShowComplaintForm(false);
    // window.scrollTo({
    //   top: 0,
    //   behavior: 'smooth'
    // });
    // Wait for next render tick then scroll to form
    setTimeout(() => {
      const formElement = document.getElementById('edit-review-form');
      formElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  };

  // Handler for delete button click in the review list
  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };

  // Handler for cancel button in the edit form
  const handleCancelEdit = () => {
    setEditingReview(null);
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
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => handleDeleteReview(reviewToDelete)}
      />
      
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
              showReviewForm || editingReview
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
          >
            {showReviewForm || editingReview ? (
              <>
                <X size={16} />
                Cancel {userReview ? 'Edit' : 'Review'}
              </>
            ) : (
              <>
                <Star size={16} />
                {userReview ? 'Edit Review' : 'Add Review'}
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
            <ReviewForm 
              onSubmit={handleAddReview} 
              onCancel={() => setShowReviewForm(false)} 
            />
          </div>
        )}
        
        {editingReview && (
          <div id="edit-review-form" className="bg-white rounded-lg shadow-card p-6 mb-6 border-l-4 border-primary-500">
            <ReviewForm 
              onSubmit={handleEditReview} 
              onCancel={handleCancelEdit}
              initialData={editingReview}
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
              <ReviewList 
                reviews={reviews} 
                currentUserId={user?._id || user?.id}
                onEditReview={handleEditClick}
                onDeleteReview={handleDeleteClick}
              />
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