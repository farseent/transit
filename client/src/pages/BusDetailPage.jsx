import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import busApi from '../api/busApi';
import { fetchBusReviews, addReview } from '../api/reviewApi';
import { addComplaint } from '../api/complaintApi';
import { useAuth } from '../context/AuthContext';

import BusInfo from '../components/busDetails/BusInfo';
import ReviewList from '../components/busDetails/ReviewList';
import ReviewForm from '../components/busDetails/ReviewForm';
import ComplaintForm from '../components/busDetails/ComplaintForm';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';

const BusDetailPage = () => {
  const { id } = useParams(); // Changed from busId to id to match route parameter
  const [searchParams] = useSearchParams();
  const fromStop = searchParams.get('fromStop');
  const toStop = searchParams.get('toStop');
  
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
        // console.log('Fetching bus details for ID:', id);
        // Fetch bus details
        const busData = await busApi.fetchBusDetails(id);
        setBus(busData.bus || busData);
        console.log('bus data in busdetailpage',busData);
        
        // Fetch reviews separately
        const reviewsData = await fetchBusReviews(id);
        setReviews(reviewsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bus details:', err);
        setError('Failed to load bus details');
        setLoading(false);
      }
    };

    if (id) {
      fetchBusDetails();
    }
  }, [id]);

  const handleAddReview = async (reviewData) => {
    try {
      // Using the dedicated review API
      const response = await addReview(id, reviewData);
      setReviews([...reviews, response]);
      setShowReviewForm(false);
    } catch (err) {
      setError('Failed to submit review');
    }
  };

  const handleAddComplaint = async (complaintData) => {
    try {
      // Using the dedicated complaint API
      await addComplaint(id, complaintData);
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
          <BusInfo bus={bus} fromStop={fromStop} toStop={toStop} />
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