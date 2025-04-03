import React, { useState } from 'react';

const ComplaintForm = ({ onSubmit, onCancel }) => {
  const [complaintType, setComplaintType] = useState('');
  const [description, setDescription] = useState('');

  const complaintTypes = [
    'Staff Behavior',
    'Hygiene',
    'Punctuality',
    'Vehicle Condition',
    'Other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      complaintType,
      description
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-card rounded-lg p-6 mt-4">
      <h3 className="text-xl font-semibold mb-4 text-danger">Report a Complaint</h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="complaintType" className="block text-sm font-medium text-gray-700 mb-2">
            Complaint Type
          </label>
          <select
            id="complaintType"
            value={complaintType}
            onChange={(e) => setComplaintType(e.target.value)}
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

      <div className="flex justify-end space-x-2 mt-4">
        <button 
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="btn btn-danger"
          disabled={!complaintType || !description}
        >
          Submit Complaint
        </button>
      </div>
    </form>
  );
};

export default ComplaintForm;