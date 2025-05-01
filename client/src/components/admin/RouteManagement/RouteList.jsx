import React, { useState } from 'react';
import Button from '../../common/Button';
import Table from '../../common/Table';
import { Edit, Trash }  from 'lucide-react';

const RouteList = ({ routes, onDelete, onEdit }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (routeId) => {
    setOpenDropdown(openDropdown === routeId ? null : routeId);
  };

  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Header>Name</Table.Header>
          <Table.Header>Stops</Table.Header>
          <Table.Header>Fare Rate</Table.Header>
          <Table.Header>Created At</Table.Header>
          <Table.Header className="text-right">Actions</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {routes.map((route) => (
          <Table.Row key={route._id}>
            <Table.Cell className="font-medium">{route.name}</Table.Cell>
            <Table.Cell>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {route.stops?.length ?? 0} stops
              </span>
            </Table.Cell>
            <Table.Cell>${parseFloat(route.fareRate).toFixed(2)}</Table.Cell>
            <Table.Cell>{new Date(route.createdAt).toLocaleDateString()}</Table.Cell>
            <Table.Cell className="text-right">
              <div className="w-full justify-end">
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onEdit(route)}
                    className="hidden sm:inline-flex"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="danger"
                    onClick={() => onDelete(route._id)}
                    className="hidden sm:inline-flex"
                  >
                    <Trash size={16} />
                  </Button>
                  {/* Improved dropdown for mobile */}
                  <div className="sm:hidden relative inline-block text-left">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="inline-flex items-center"
                      onClick={() => toggleDropdown(route._id)}
                    >
                      Actions
                      <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Button>
                    {openDropdown === route._id && (
                      <div className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1" role="menu">
                          <button 
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            onClick={() => {
                              onEdit(route);
                              setOpenDropdown(null);
                            }}
                          >
                            Edit
                          </button>
                          <button 
                            className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
                            onClick={() => {
                              onDelete(route._id);
                              setOpenDropdown(null);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default RouteList;