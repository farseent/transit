import React from 'react';
import PropTypes from 'prop-types';

const Table = ({ headers, children, className = '' }) => {
  const isCompoundStructure = React.Children.toArray(children).some(
    (child) => child?.type?.displayName?.includes('Table')
  );

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        {/* If using default headers */}
        {headers && (
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th 
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}

        {/* Render children directly if compound structure is used */}
        {isCompoundStructure ? (
          children
        ) : (
          <tbody className="bg-white divide-y divide-gray-200">
            {children}
          </tbody>
        )}
      </table>
    </div>
  );
};

// Compound components
const Head = ({ children }) => (
  <thead className="bg-gray-50">{children}</thead>
);
Head.displayName = 'TableHead';

const Body = ({ children }) => (
  <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
);
Body.displayName = 'TableBody';

const Row = ({ children }) => (
  <tr className="hover:bg-gray-50">{children}</tr>
);
Row.displayName = 'TableRow';

const Header = ({ children }) => (
  <th 
    scope="col" 
    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
  >
    {children}
  </th>
);
Header.displayName = 'TableHeader';

const Cell = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    {children}
  </td>
);
Cell.displayName = 'TableCell';

Table.Head = Head;
Table.Body = Body;
Table.Row = Row;
Table.Header = Header;
Table.Cell = Cell;

Table.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

Table.defaultProps = {
  headers: null,
  className: ''
};

export default Table;
