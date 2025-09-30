const Table = ({ columns, data, onRowClick, className = '' }) => {
  return (
    <div className={`overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg ${className}`}>
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="table-header"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${
                onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''
              } ${row.highlight ? 'bg-yellow-50' : ''}`}
              onClick={() => onRowClick && onRowClick(row, rowIndex)}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="table-cell">
                  {column.accessor
                    ? typeof column.accessor === 'function'
                      ? column.accessor(row)
                      : row[column.accessor]
                    : column.cell
                    ? column.cell(row)
                    : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No data available</p>
        </div>
      )}
    </div>
  );
};

export default Table;