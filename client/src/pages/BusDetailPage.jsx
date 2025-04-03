import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import busApi from '../api/busApi';
import { useAuth } from '../context/AuthContext';

import BusInfo from '../components/busDetails/BusInfo';
import ReviewList from '../components/busDetails/ReviewList';
import ReviewForm from '../components/busDetails/ReviewForm';
import ComplaintForm from '../components/busDetails/ComplaintForm';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';

const BusDetailPage = () => {
  const { busId } = useParams();
  const { isAuthenticated } = useAuth();
  const [bus, setBus] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showComplaintForm, setShowComplaintForm] = useState(false);

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        const busResponse = await busApi.getBusById(busId);
        const reviewsResponse = await busApi.getBusReviews(busId);
        
        setBus(busResponse.data);
        setReviews(reviewsResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load bus details');
        setLoading(false);
      }
    };

    fetchBusDetails();
  }, [busId]);

  const handleAddReview = async (reviewData) => {
    try {
      const response = await busApi.addReview(busId, reviewData);
      setReviews([...reviews, response.data]);
      setShowReviewForm(false);
    } catch (err) {
      setError('Failed to submit review');
    }
  };

  const handleAddComplaint = async (complaintData) => {
    try {
      await busApi.addComplaint(busId, complaintData);
      setShowComplaintForm(false);
      alert('Complaint submitted successfully');
    } catch (err) {
      setError('Failed to submit complaint');
    }
  };

  if (loading) return <Loader />;
  if (error) return <Alert type="danger" message={error} />;
  if (!bus) return <Alert type="warning" message="Bus not found" />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Bus Information Section */}
        <div>
          <BusInfo bus={bus} />
        </div>

        {/* Reviews Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Reviews</h2>
            {isAuthenticated && (
              <button 
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="btn btn-primary"
              >
                {showReviewForm ? 'Cancel' : 'Add Review'}
              </button>
            )}
          </div>

          {showReviewForm && isAuthenticated && (
            <ReviewForm 
              onSubmit={handleAddReview} 
              onCancel={() => setShowReviewForm(false)} 
            />
          )}

          <ReviewList reviews={reviews} />

          {isAuthenticated && (
            <div className="mt-4">
              <button 
                onClick={() => setShowComplaintForm(!showComplaintForm)}
                className="btn btn-danger"
              >
                {showComplaintForm ? 'Cancel' : 'Report Complaint'}
              </button>

              {showComplaintForm && (
                <ComplaintForm 
                  onSubmit={handleAddComplaint} 
                  onCancel={() => setShowComplaintForm(false)} 
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusDetailPage;