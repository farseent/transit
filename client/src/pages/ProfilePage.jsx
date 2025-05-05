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
import { Tab } from '@headlessui/react';

const ProfilePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalReviews: 0,
    totalComplaints: 0,
    resolvedComplaints: 0
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/profile' } });
      return;
    }
    if (isAuthenticated) {
      fetchProfileData();
    }
  }, [isAuthenticated, navigate]);
  
  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const profileResponse = await getProfile();
      setProfileData(profileResponse);  
      const reviewsResponse = await getUserReviews();
      setReviews(reviewsResponse);        
      const complaintsResponse = await getUserComplaints();
      setComplaints(complaintsResponse);
      
      // Calculate stats
      setStats({
        totalReviews: reviewsResponse.length,
        totalComplaints: complaintsResponse.length,
        resolvedComplaints: complaintsResponse.filter(c => c.status.toLowerCase() === 'resolved').length
      });
    } catch (err) {
      console.error('Failed to fetch profile data:', err);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleReviewUpdate = () => {
    // Refresh user profile to get updated reviews
    fetchProfileData();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {error && <Alert type="error" message={error} />}
      
      {/* Profile Header with Avatar */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="bg-white rounded-full p-1 shadow-md">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-primary-500">
              {profileData?.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
          <div className="text-center md:text-left text-white">
            <h1 className="text-3xl font-bold mb-2">{profileData?.name}</h1>
            <p className="mb-3">{profileData?.email}</p>
            <p className="text-primary-100">Member since: {profileData && new Date(profileData.createdAt).toLocaleDateString()}</p>
            {profileData?.role === 'owner' && (
              <span className="inline-block mt-2 bg-primary-800 text-white px-3 py-1 rounded-full text-sm">
                Bus Owner
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-5 flex flex-col items-center">
          <span className="text-4xl font-bold text-primary-500 mb-2">{stats.totalReviews}</span>
          <span className="text-gray-600">Reviews Submitted</span>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5 flex flex-col items-center">
          <span className="text-4xl font-bold text-primary-500 mb-2">{stats.totalComplaints}</span>
          <span className="text-gray-600">Complaints Filed</span>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5 flex flex-col items-center">
          <span className="text-4xl font-bold text-green-500 mb-2">{stats.resolvedComplaints}</span>
          <span className="text-gray-600">Resolved Complaints</span>
        </div>
      </div>
      
      {/* Tabbed Content */}
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-primary-100 p-1 mb-6">
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors
            ${selected 
              ? 'bg-white shadow text-primary-600' 
              : 'text-primary-700 hover:bg-white/[0.12] hover:text-primary-600'}`
          }>
            Profile Information
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors
            ${selected 
              ? 'bg-white shadow text-primary-600' 
              : 'text-primary-700 hover:bg-white/[0.12] hover:text-primary-600'}`
          }>
            My Reviews <span className="ml-1 inline-block bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">{stats.totalReviews}</span>
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors
            ${selected 
              ? 'bg-white shadow text-primary-600' 
              : 'text-primary-700 hover:bg-white/[0.12] hover:text-primary-600'}`
          }>
            My Complaints <span className="ml-1 inline-block bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">{stats.totalComplaints}</span>
          </Tab>
        </Tab.List>
        
        <Tab.Panels className="mt-2">
          {/* Profile Information Panel */}
          <Tab.Panel className="rounded-xl bg-white p-6 shadow-md">
            {profileData && <UserInfo user={profileData} />}
          </Tab.Panel>
          
          {/* Reviews Panel */}
          <Tab.Panel className="rounded-xl bg-white p-6 shadow-md">
            <ReviewHistory reviews={reviews} onReviewUpdate={handleReviewUpdate} />
          </Tab.Panel>
          
          {/* Complaints Panel */}
          <Tab.Panel className="rounded-xl bg-white p-6 shadow-md">
            <ComplaintHistory complaints={complaints} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ProfilePage;