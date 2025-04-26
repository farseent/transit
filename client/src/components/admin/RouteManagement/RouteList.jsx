import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Button } from '../common';

const RouteList = ({ routes, onDelete }) => {
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
            <Table.Cell>{route.stops.length}</Table.Cell>
            <Table.Cell>{route.fareRate}</Table.Cell>
            <Table.Cell>{new Date(route.createdAt).toLocaleDateString()}</Table.Cell>
            <Table.Cell>
              <div className="flex space-x-2">
                <Link to={`/admin/routes/edit/${route._id}`}>
                  <Button size="sm" variant="outline">Edit</Button>
                </Link>
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