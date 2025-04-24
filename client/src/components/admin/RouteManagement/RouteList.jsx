const RouteList = ({ routes }) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Route Name</th>
              <th className="py-2 px-4 border-b">Start Point</th>
              <th className="py-2 px-4 border-b">End Point</th>
              <th className="py-2 px-4 border-b">Stops</th>
              <th className="py-2 px-4 border-b">Base Fare</th>
            </tr>
          </thead>
          <tbody>
            {routes.map(route => (
              <tr key={route._id}>
                <td className="py-2 px-4 border-b">{route.name}</td>
                <td className="py-2 px-4 border-b">{route.startPoint}</td>
                <td className="py-2 px-4 border-b">{route.endPoint}</td>
                <td className="py-2 px-4 border-b">
                  <div className="max-h-20 overflow-y-auto">
                    {route.stops.map((stop, index) => (
                      <div key={index} className="text-sm">
                        {stop.name} (${stop.fareFromStart})
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-2 px-4 border-b">${route.baseFare}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default RouteList;