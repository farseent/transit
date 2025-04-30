import Button from "../../common/Button";

const BusList = ({ buses, onEditBus, onDeleteBus }) => {
  console.log('bus data recieved in buslist :',buses);
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Reg. Number</th>
            <th className="py-2 px-4 border-b">Route</th>
            <th className="py-2 px-4 border-b">Owner</th>
            <th className="py-2 px-4 border-b">Schedules</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {buses.map(bus => (
            <tr key={bus._id}>
              <td className="py-2 px-4 border-b">{bus.name}</td>
              <td className="py-2 px-4 border-b">{bus.regNumber}</td>
              <td className="py-2 px-4 border-b">
                {bus.route?.name || 'Unassigned'}
              </td>
              <td className="py-2 px-4 border-b">
                {bus.owner?.name || 'Unassigned'}
              </td>
              <td className="py-2 px-4 border-b">
                {bus.schedules?.length > 0 ? (
                  <ul className="list-disc pl-4">
                    {bus.schedules.map((schedule, index) => (
                      <li key={index}>{schedule.departureTime}</li>
                    ))}
                  </ul>
                ) : 'No schedules'}
              </td>
              <td className="py-2 px-4 border-b space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onEditBus(bus)}
                >
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="danger"
                  onClick={() => onDeleteBus(bus._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusList;