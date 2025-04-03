// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserInfo from '../components/profile/UserInfo';
import ReviewHistory from '../components/profile/ReviewHistory';
import ComplaintHistory from '../components/profile/ComplaintHistory';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import { useAuth } from '../context/AuthContext';
import { getProfile, getUserReviews, getUserComplaints } from '../api/userApi';

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/profile' } });
      return;
    }
    
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch user profile data - no need to pass user ID as the API should use the authenticated user's token
        const profileResponse = await getProfile();
        setProfileData(profileResponse);
        
        // Fetch user reviews
        const reviewsResponse = await getUserReviews();
        setReviews(reviewsResponse);
        
        // Fetch user complaints
        const complaintsResponse = await getUserComplaints();
        setComplaints(complaintsResponse);
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch data if the user is authenticated
    if (isAuthenticated) {
      fetchProfileData();
    }
  }, [isAuthenticated, navigate]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      {error && <Alert type="error" message={error} />}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          {profileData && <UserInfo user={profileData} />}
        </div>
        
        <div className="md:col-span-2">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Reviews</h2>
            <ReviewHistory reviews={reviews} />
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Complaints</h2>
            <ComplaintHistory complaints={complaints} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;