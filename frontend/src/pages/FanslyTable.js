import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FanslyTable = () => {
  const [fanslyRecords, setFanslyRecords] = useState([]);

  useEffect(() => {
    const fetchFanslyRecords = async () => {
      const response = await axios.get('http://localhost:5000/api/fansly');
      setFanslyRecords(response.data);
    };

    fetchFanslyRecords();
  }, []);

  return (
    <div>
      <h1>Смены Fansly</h1>
      <Link to="/fansly/add">
        <button>Добавить смену Fansly</button>
      </Link>
      <table>
        <thead>
          <tr>
            <th>Дата</th>
            <th>Модель</th>
            <th>Оператор</th>
            <th>Чек</th>
          </tr>
        </thead>
        <tbody>
          {fanslyRecords.map((record) => (
            <tr key={record.id}>
              <td>{new Date(record.date).toLocaleDateString()}</td>
              <td>{record.Model ? record.Model.name : 'N/A'}</td>   {/* Исправлено на Model с заглавной буквы */}
              <td>{record.Operator ? record.Operator.name : 'N/A'}</td> {/* Исправлено на Operator с заглавной буквы */}
              <td>{record.check}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FanslyTable;
