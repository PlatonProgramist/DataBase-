import React, { useState } from 'react';
import axios from 'axios';
import './AddOperatorPage.css';

const AddOperatorPage = () => {
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(''); // Сброс ошибки перед новой попыткой

    if (!name) {
      setErrorMessage('Имя обязательно');
      return;
    }

    try {
      const response = await axios.post('/api/operators', { name });
      console.log('Оператор успешно добавлен:', response.data);
      setName('');
      alert('Оператор успешно добавлен!');
    } catch (error) {
      console.error('Ошибка при добавлении оператора:', error.response ? error.response.data : error.message);
      setErrorMessage('Ошибка при добавлении оператора. Пожалуйста, попробуйте позже.');
    }
  };

  return (
    <div className="form-container">
      <h2>Добавить оператора</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Имя:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <button type="submit">Добавить оператора</button>
      </form>
    </div>
  );
};

export default AddOperatorPage;
