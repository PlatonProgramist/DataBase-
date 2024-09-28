import React, { useEffect, useState } from 'react';
import ChartComponent from '../components/ChartComponent';
import axios from 'axios';

const StatisticsPage = () => {
  const [shifts, setShifts] = useState([]);
  const [modelId, setModelId] = useState('');
  const [operatorId, setOperatorId] = useState('');
  const [models, setModels] = useState([]);
  const [operators, setOperators] = useState([]);

  useEffect(() => {
    // Загружаем модели и операторов
    const fetchData = async () => {
      try {
        const modelsData = await axios.get('/api/models');
        const operatorsData = await axios.get('/api/operators');
        setModels(modelsData.data);
        setOperators(operatorsData.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных моделей и операторов:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('/api/statistics', {
          params: { modelId, operatorId },
        });
        // Реверсируем данные перед установкой состояния
        const reversedShifts = response.data.slice().reverse();
        setShifts(reversedShifts);
      } catch (error) {
        console.error('Ошибка при загрузке статистики:', error);
      }
    };
    fetchStatistics();
  }, [modelId, operatorId]);

  return (
    <div>
      <h1>Статистика</h1>
      <div>
        <label>Выберите модель:</label>
        <select onChange={e => setModelId(e.target.value)} value={modelId}>
          <option value=''>Все модели</option>
          {models.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>

        <label>Выберите оператора:</label>
        <select onChange={e => setOperatorId(e.target.value)} value={operatorId}>
          <option value=''>Все операторы</option>
          {operators.map(operator => (
            <option key={operator.id} value={operator.id}>
              {operator.name}
            </option>
          ))}
        </select>
      </div>

      <ChartComponent shifts={shifts} />
    </div>
  );
};

export default StatisticsPage;
