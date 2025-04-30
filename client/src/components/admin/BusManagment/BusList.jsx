import BusOwnerAssign from "./BusOwnerAssign";
import BusRouteAssign from "./BusRouteAssign";

const BusList = ({ buses, owners, routes, onAssignOwner, onAssignRoute }) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Reg. Number</th>
              <th className="py-2 px-4 border-b">Route</th>
              <th className="py-2 px-4 border-b">Owner</th>
            </tr>
          </thead>
          <tbody>
            {buses.map(bus => (
              <tr key={bus._id}>
                <td className="py-2 px-4 border-b">{bus.name}</td>
                <td className="py-2 px-4 border-b">{bus.regNumber}</td>
                {/* <td className="py-2 px-4 border-b">{bus.route}</td> */}
                <td className="py-2 px-4 border-b">
                  <BusRouteAssign 
                    busId={bus._id}
                    currentRoute={bus.route}
                    routes={routes}
                    onAssign={onAssignRoute}
                  />
              </td>
                <td className="py-2 px-4 border-b">
                  <BusOwnerAssign 
                    busId={bus._id}
                    currentOwner={bus.owner?._id}
                    owners={owners}
                    onAssign={onAssignOwner}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default BusList;