const BusDetailCard = ({ bus }) => {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">{bus.name}</h2>
          <p className="text-gray-500">Route: {bus.route}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <div>
            <p><span className="font-semibold">Timing:</span> {bus.timing}</p>
            <p><span className="font-semibold">Fare:</span> ₹{bus.fare}</p>
            <p><span className="font-semibold">Status:</span> {bus.isAvailable ? "Available" : "Not Available"}</p>
          </div>
  
          <div>
            <p><span className="font-semibold">Total Reviews:</span> {bus.reviews?.length || 0}</p>
            <p><span className="font-semibold">Complaints:</span> {bus.complaints?.length || 0}</p>
          </div>
        </div>
  
        {bus.description && (
          <div>
            <h3 className="text-lg font-semibold mt-4">Description</h3>
            <p className="text-gray-600">{bus.description}</p>
          </div>
        )}
      </div>
    );
  };
  
  export default BusDetailCard;
  