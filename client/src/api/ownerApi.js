import axios from './axios';

export default{
    getOwnerBuses: async () =>{
       const response = await axios.get('/owner/buses');
       return response.data;
    }, 
    toggleBusAvailability: async (busId) => {
      const response = await axios.put(`/owner/buses/${busId}/toggle-availability`)
      return response.data;  
    },
    getOwnerBusDetails: async (busId) => {
      const response = await axios.get(`/owner/buses/${busId}`);
      return response.data;
    },
    getBusReviews: async (busId) => {
      const response = await axios.get(`/owner/buses/${busId}/reviews`);
      return response.data;
    },
}