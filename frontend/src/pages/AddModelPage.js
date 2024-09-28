import React, { useState } from 'react';
import axios from 'axios';
import './AddModelPage.css';

const AddModelPage = () => {
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!name) {
      setErrorMessage('Имя обязательно');
      return;
    }

    try {
      const response = await axios.post('/api/models', { name });
      console.log('Модель успешно добавлена:', response.data);
      setName('');
      alert('Модель успешно добавлена!');
    } catch (error) {
      console.error('Ошибка при добавлении модели:', error.response ? error.response.data : error.message);
      setErrorMessage('Произошла ошибка при добавлении модели. Пожалуйста, попробуйте позже.');
    }
  };

  return (
    <div className="form-container">
      <h1>Добавить модель</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Имя:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <button type="submit">Добавить модель</button>
      </form>
    </div>
  );
};

export default AddModelPage;
