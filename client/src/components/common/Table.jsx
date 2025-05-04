import React from 'react';
import PropTypes from 'prop-types';

const Table = ({ headers, children, data, columns, className = '', onRowClick, emptyMessage = 'No data found' }) => {
  const isCompoundStructure = React.Children.toArray(children).some(
    (child) => child?.type?.displayName?.includes('Table')
  );

  const shouldRenderFromProps = !isCompoundStructure && data && columns;
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        {(headers || columns) && (
          <thead className="bg-gray-50">
            <tr>
              {(headers || columns.map(col => col.header)).map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}

        {isCompoundStructure ? (
          children
        ) : shouldRenderFromProps ? (
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50" onClick={() => onRowClick?.(row)}>
                  {columns.map((col, colIndex) => {
                    const value = col.accessor?.split('.').reduce((acc, key) => acc?.[key], row);
                    return (
                      <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {col.cell ? col.cell(row) : value}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center px-6 py-4 text-sm text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        ) : null}
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

const Row = ({ children, onClick }) => (
  <tr 
    className="hover:bg-gray-50"
    onClick={onClick}
    >
      {children}
    </tr>
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
  data: PropTypes.array,
  columns: PropTypes.array,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  emptyMessage: PropTypes.string,
  onRowClick: PropTypes.func,
};

Table.defaultProps = {
  headers: null,
  className: '',
  onRowClick: null,
};

export default Table;
