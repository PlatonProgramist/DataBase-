import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useTable, useSortBy } from 'react-table';

const OperatorTable = () => {
  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState('');
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const response = await axios.get('/api/operators');
        setOperators(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке операторов:', error);
      }
    };

    fetchOperators();
  }, []);

  useEffect(() => {
    if (selectedOperator) {
      const fetchShifts = async () => {
        try {
          const response = await axios.get(`/api/operators/${selectedOperator}/shifts`);
          setShifts(response.data);
        } catch (error) {
          console.error('Ошибка при загрузке смен для оператора:', error);
        }
      };

      fetchShifts();
    }
  }, [selectedOperator]);

  const columns = useMemo(
    () => [
      {
        Header: 'Дата',
        accessor: 'date',
        Cell: ({ value }) => new Date(value).toLocaleDateString(), // Форматирование даты
      },
      {
        Header: 'Модель',
        accessor: 'Model.name',
      },
      {
        Header: 'Чек',
        accessor: 'check',
      },
      {
        Header: 'CB',
        accessor: 'CB',
      },
      {
        Header: 'SC',
        accessor: 'SC',
      },
      {
        Header: 'SP',
        accessor: 'SP',
      },
      {
        Header: 'BC',
        accessor: 'BC',
      },
      {
        Header: 'LF',
        accessor: 'LF',
      },
      {
        Header: 'PP_BTC',  // Новый столбец
        accessor: 'PP_BTC',
      },
      {
        Header: 'Other',  // Новый столбец
        accessor: 'Other',
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    { columns, data: shifts },
    useSortBy
  );

  return (
    <div>
      <h1>Операторы</h1>
      <label htmlFor="operator-select">Выберите оператора:</label>
      <select
        id="operator-select"
        value={selectedOperator}
        onChange={(e) => setSelectedOperator(e.target.value)}
      >
        <option value="">--Выберите оператора--</option>
        {operators.map((operator) => (
          <option key={operator.id} value={operator.id}>
            {operator.name}
          </option>
        ))}
      </select>

      {selectedOperator && (
        <div>
          <h2>Смены для оператора {operators.find(op => op.id === selectedOperator)?.name}</h2>
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render('Header')}
                      <span>
                        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OperatorTable;
