import React from 'react';

const Table = ({ headers, data }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {headers.map((header, idx) => (
                <td key={idx}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
