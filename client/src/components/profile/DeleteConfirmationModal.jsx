// src/components/profile/DeleteConfirmationModal.jsx
import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onCancel, onConfirm, busName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Delete Review</h3>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete your review for <span className="font-semibold">{busName}</span>? This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Delete Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;