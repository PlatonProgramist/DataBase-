import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ShiftsTable.css';  // Импортируйте CSS-файл

const ShiftsTable = () => {
  const [shifts, setShifts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [error, setError] = useState(null);  // Для хранения ошибок

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/shifts');
        const shiftsData = response.data;

        // Проверка, является ли полученный результат массивом
        if (Array.isArray(shiftsData)) {
          setShifts(shiftsData);
        } else {
          console.error("Полученные данные не являются массивом:", shiftsData);
          setError("Неверный формат данных от сервера.");
          setShifts([]);
        }
      } catch (error) {
        console.error("Ошибка при получении смен:", error);
        setError("Не удалось получить смены.");
        setShifts([]);  // Установка пустого массива в случае ошибки
      }
    };
    fetchShifts();
  }, []);

  const sortedShifts = [...shifts].sort((a, b) => {
    if (sortConfig.key) {
      const isAscending = sortConfig.direction === 'asc';
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return isAscending ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return isAscending ? 1 : -1;
      }
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="table-container">
      <h1>Shifts</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Отображение ошибки, если она есть */}
      <table>
        <thead>
          <tr>
            <th>
              Date
              <button className="sort-button" onClick={() => handleSort('date')}>
                <span className={`sort-icon ${sortConfig.key === 'date' ? sortConfig.direction : ''}`}></span>
              </button>
            </th>
            <th>
              Model
              {/* Вы можете добавить сортировку по модели здесь, если это необходимо */}
            </th>
            <th>
              Operator
              {/* Вы можете добавить сортировку по оператору здесь, если это необходимо */}
            </th>
            <th>
              Check
              <button className="sort-button" onClick={() => handleSort('check')}>
                <span className={`sort-icon ${sortConfig.key === 'check' ? sortConfig.direction : ''}`}></span>
              </button>
            </th>
            <th>CB</th>
            <th>SC</th>
            <th>SP</th>
            <th>BC</th>
            <th>LF</th>
            <th>PP_BTC</th> {/* Добавлено поле PP_BTC */}
            <th>Other</th>  {/* Добавлено поле Other */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedShifts.map(shift => (
            <tr key={shift.id}>
              <td>{shift.date}</td>
              <td>{shift.Model ? shift.Model.name : 'N/A'}</td>
              <td>{shift.Operator ? shift.Operator.name : 'N/A'}</td>
              <td>{shift.check}</td>
              <td>{shift.CB}</td>
              <td>{shift.SC}</td>
              <td>{shift.SP}</td>
              <td>{shift.BC}</td>
              <td>{shift.LF}</td>
              <td>{shift.PP_BTC}</td> {/* Отображение поля PP_BTC */}
              <td>{shift.Other}</td>  {/* Отображение поля Other */}
              <td>
                <Link to={`/shift/edit/${shift.id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftsTable;
