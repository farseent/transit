// src/components/owner/OwnerBusHeader.jsx
const OwnerBusHeader = ({ bus, onBack, onToggleAvailability }) => {
    return (
      <div className="bg-blue-600 text-white p-6 mb-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Bus Details</h1>
              <p className="mt-2 opacity-80">{bus.name} - {bus.regNumber}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onToggleAvailability}
                className={`px-6 py-2 rounded-md font-medium text-white transition ${
                  bus.isAvailable 
                    ? 'bg-yellow-500 hover:bg-yellow-600' 
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {bus.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
              </button>
              <button
                onClick={onBack}
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default OwnerBusHeader;