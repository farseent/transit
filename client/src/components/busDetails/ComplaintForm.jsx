import React, { useState } from 'react';

const ComplaintForm = ({ onSubmit, onCancel }) => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const complaintTypes = [
    'Late Arrival', 'Early Departure', 'Cleanliness', 'Staff Behavior', 'Safety Concern', 'Other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      category,
      description
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-card rounded-lg p-6 mt-4">
      <h3 className="text-xl font-semibold mb-4 text-danger">Report a Complaint</h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Complaint Type
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          >
            <option value="">Select Complaint Type</option>
            {complaintTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide details about your complaint"
            required
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button 
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-secondary-500 text-white font-medium rounded-md hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="px-4 py-2 bg-danger text-white font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!category || !description}
        >
          Submit Complaint
        </button>
      </div>
    </form>
  );
};

export default ComplaintForm;