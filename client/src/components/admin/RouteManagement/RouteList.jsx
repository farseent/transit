import React from 'react';
import Button from '../../common/Button';
import Table from '../../common/Table';

const RouteList = ({ routes, onDelete, onEdit  }) => {
  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Header>Name</Table.Header>
          <Table.Header>Stops</Table.Header>
          <Table.Header>Fare Rate</Table.Header>
          <Table.Header>Created At</Table.Header>
          <Table.Header>Actions</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {routes.map((route) => (
          <Table.Row key={route._id}>
            <Table.Cell>{route.name}</Table.Cell>
            <Table.Cell>{route.stops?.length ?? 0}</Table.Cell>
            <Table.Cell>{route.fareRate}</Table.Cell>
            <Table.Cell>{new Date(route.createdAt).toLocaleDateString()}</Table.Cell>
            <Table.Cell>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                    variant="outline"
                    onClick={() => onEdit(route)}
                  >
                    Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="danger"
                  onClick={() => onDelete(route._id)}
                >
                  Delete
                </Button>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default RouteList;