import BusOwnerAssign from "./BusOwnerAssign";

const BusList = ({ buses, owners, onAssignOwner }) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Reg. Number</th>
              {/* <th className="py-2 px-4 border-b">Type</th> */}
              <th className="py-2 px-4 border-b">Route</th>
              <th className="py-2 px-4 border-b">Owner</th>

            </tr>
          </thead>
          <tbody>
            {buses.map(bus => (
              <tr key={bus._id}>
                <td className="py-2 px-4 border-b">{bus.name}</td>
                <td className="py-2 px-4 border-b">{bus.regNumber}</td>
                {/* <td className="py-2 px-4 border-b capitalize">{bus.type}</td> */}
                <td className="py-2 px-4 border-b">{bus.route}</td>
                <td className="py-2 px-4 border-b">
                  <BusOwnerAssign 
                    busId={bus._id}
                    currentOwner={bus.owner?._id}
                    owners={owners}
                    onAssign={onAssignOwner}
                  />
                </td>
                {/* <td className="py-2 px-4 border-b">
                  <span className={`px-2 py-1 rounded text-xs ${
                    bus.isAvailable === 'true' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {bus.isAvailable}
                  </span>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default BusList;