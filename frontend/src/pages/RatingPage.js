import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RatingPage.css'; // Стили

const RatingPage = () => {
  const [modelRatings, setModelRatings] = useState([]);
  const [operatorRatings, setOperatorRatings] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [operatorInfo, setOperatorInfo] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const modelResponse = await axios.get('/api/models/ratings');
        const operatorResponse = await axios.get('/api/operators/ratings');

        const sortedModels = modelResponse.data.sort((a, b) => b.averageRating - a.averageRating);
        const sortedOperators = operatorResponse.data.sort((a, b) => b.averageRating - a.averageRating);

        setModelRatings(sortedModels);
        setOperatorRatings(sortedOperators);
      } catch (error) {
        console.error('Ошибка при загрузке данных рейтингов:', error);
      }
    };

    fetchRatings();
  }, []);

  const handleModelSelect = async (event) => {
    const modelId = event.target.value;
    setSelectedModel(modelId);

    if (modelId) {
      try {
        const response = await axios.get(`/api/models/${modelId}/rating`);
        const modelData = response.data;
        const rankingPosition = modelRatings.findIndex((model) => model.id === Number(modelId)) + 1;
        setModelInfo({ ...modelData, rank: rankingPosition });
      } catch (error) {
        console.error('Ошибка при загрузке данных модели:', error);
      }
    }
  };

  const handleOperatorSelect = async (event) => {
    const operatorId = event.target.value;
    setSelectedOperator(operatorId);

    if (operatorId) {
      try {
        const response = await axios.get(`/api/operators/${operatorId}/rating`);
        const operatorData = response.data;
        const rankingPosition = operatorRatings.findIndex((operator) => operator.id === Number(operatorId)) + 1;
        setOperatorInfo({ ...operatorData, rank: rankingPosition });
      } catch (error) {
        console.error('Ошибка при загрузке данных оператора:', error);
      }
    }
  };

  return (
    <div className="rating-page">
      <h1>Рейтинг моделей и операторов</h1>

      <div className="selector-container">
        <div>
          <label>Выберите модель:</label>
          <select onChange={handleModelSelect} className="dropdown" value={selectedModel || ''}>
            <option value="" disabled>Выберите из списка</option>
            {modelRatings.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>

          {modelInfo && (
            <div className="rating-details">
              <h3>Информация о модели</h3>
              <p>Место в рейтинге: {modelInfo.rank}</p>
              <p>Общий заработок: {modelInfo.totalCheck}</p>
              <p>Количество смен: {modelInfo.shiftCount}</p>
              <p>Средний показатель: {modelInfo.averageRating.toFixed(2)}</p>
            </div>
          )}
        </div>

        <div>
          <label>Выберите оператора:</label>
          <select onChange={handleOperatorSelect} className="dropdown" value={selectedOperator || ''}>
            <option value="" disabled>Выберите из списка</option>
            {operatorRatings.map((operator) => (
              <option key={operator.id} value={operator.id}>
                {operator.name}
              </option>
            ))}
          </select>

          {operatorInfo && (
            <div className="rating-details">
              <h3>Информация об операторе</h3>
              <p>Место в рейтинге: {operatorInfo.rank}</p>
              <p>Общий заработок: {operatorInfo.totalCheck}</p>
              <p>Количество смен: {operatorInfo.shiftCount}</p>
              <p>Средний показатель: {operatorInfo.averageRating.toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>

      <div className="rankings-container">
        <div className="rankings">
          <div className="table-container">
            <h2>Рейтинг моделей</h2>
            <table>
              <thead>
                <tr>
                  <th>Ранг</th>
                  <th>Модель</th>
                  <th>Смены</th>
                  <th>Общий заработок</th>
                  <th>Средний показатель</th>
                </tr>
              </thead>
              <tbody>
                {modelRatings.map((model, index) => (
                  <tr key={model.id}>
                    <td>{index + 1}</td>
                    <td>{model.name}</td>
                    <td>{model.shifts}</td>
                    <td>{model.totalCheck}</td>
                    <td>{model.averageRating.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-container">
            <h2>Рейтинг операторов</h2>
            <table>
              <thead>
                <tr>
                  <th>Ранг</th>
                  <th>Оператор</th>
                  <th>Смены</th>
                  <th>Общий заработок</th>
                  <th>Средний показатель</th>
                </tr>
              </thead>
              <tbody>
                {operatorRatings.map((operator, index) => (
                  <tr key={operator.id}>
                    <td>{index + 1}</td>
                    <td>{operator.name}</td>
                    <td>{operator.shifts}</td>
                    <td>{operator.totalCheck}</td>
                    <td>{operator.averageRating.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingPage;
