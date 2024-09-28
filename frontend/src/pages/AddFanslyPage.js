import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddFanslyPage.css';

const AddFanslyPage = () => {
  const [date, setDate] = useState('');
  const [check, setCheck] = useState('');
  const [operatorId, setOperatorId] = useState('');
  const [modelId, setModelId] = useState('');
  const [operators, setOperators] = useState([]);
  const [models, setModels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOperators = async () => {
      const response = await axios.get('http://localhost:5000/api/operators');
      setOperators(response.data);
    };

    const fetchModels = async () => {
      const response = await axios.get('http://localhost:5000/api/models');
      setModels(response.data);
    };

    fetchOperators();
    fetchModels();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const recordData = {
      date,
      check,
      operatorId,
      modelId,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/fansly', recordData);
      console.log('Запись создана:', response.data);
      navigate('/fansly');
    } catch (error) {
      console.error('Ошибка при создании записи:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="form-container">
      <h1>Добавить смену Fansly</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
        />
        <input 
          type="number" 
          value={check} 
          placeholder="Чек" 
          onChange={(e) => setCheck(e.target.value)} 
          required 
        />
        <select value={operatorId} onChange={(e) => setOperatorId(e.target.value)} required>
          <option value="">Выберите оператора</option>
          {operators.map((operator) => (
            <option key={operator.id} value={operator.id}>
              {operator.name}
            </option>
          ))}
        </select>
        <select value={modelId} onChange={(e) => setModelId(e.target.value)} required>
          <option value="">Выберите модель</option>
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
        <button type="submit">Добавить смену</button>
      </form>
    </div>
  );
};

export default AddFanslyPage;
