// src/pages/OwnerBusDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// import { getOwnerBusDetail } from '../api/busApi';
import busApi from '../api/busApi';
import BusDetailHeader from '../components/owner/BusDetailHeader';
import RatingSummary from '../components/owner/RatingSummary';
import ReviewList from '../components/owner/ReviewList';
// import ComplaintList from '../components/owner/ComplaintList';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';

const OwnerBusDetailPage = () => {
  const { busId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busData, setBusData] = useState(null);

  useEffect(() => {
    const fetchBusDetail = async () => {
      try {
        setLoading(true);
        const data = await busApi.getOwnerBusById(busId);
        setBusData(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load bus details');
      } finally {
        setLoading(false);
      }
    };

    fetchBusDetail();
  }, [busId]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error} />
        <div className="mt-4">
          <Link 
            to="/owner/dashboard" 
            className="text-primary-500 hover:text-primary-600"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { bus, reviews, categoryRatings,/* {complaints}*/ totalReviews } = busData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          to="/owner/dashboard" 
          className="text-primary-500 hover:text-primary-600"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      <BusDetailHeader bus={bus} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <RatingSummary 
            categoryRatings={categoryRatings} 
            totalReviews={totalReviews} 
          />
        </div>
        <div className="md:col-span-2">
          <ReviewList reviews={reviews} />
          {/* <ComplaintList complaints={complaints} /> */}
        </div>
      </div>
    </div>
  );
};

export default OwnerBusDetailPage;