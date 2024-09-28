import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useTable, useSortBy } from 'react-table';

const ModelTable = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get('/api/models');
        setModels(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке моделей:', error);
      }
    };

    fetchModels();
  }, []);

  useEffect(() => {
    if (selectedModel) {
      const fetchShifts = async () => {
        try {
          const response = await axios.get(`/api/models/${selectedModel}/shifts`);
          setShifts(response.data);
        } catch (error) {
          console.error('Ошибка при загрузке смен для модели:', error);
        }
      };

      fetchShifts();
    }
  }, [selectedModel]);

  const columns = useMemo(
    () => [
      {
        Header: 'Дата',
        accessor: 'date',
        Cell: ({ value }) => new Date(value).toLocaleDateString(), // Форматирование даты
      },
      {
        Header: 'Оператор',
        accessor: 'Operator.name',
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
      <h1>Модели</h1>
      <label htmlFor="model-select">Выберите модель:</label>
      <select
        id="model-select"
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
      >
        <option value="">--Выберите модель--</option>
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>

      {selectedModel && (
        <div>
          <h2>Смены для модели {models.find(md => md.id === selectedModel)?.name}</h2>
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

export default ModelTable;
