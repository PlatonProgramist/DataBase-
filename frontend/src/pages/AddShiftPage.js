import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddShiftPage.css'; // Подключаем стили

const AddShiftForm = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [check, setCheck] = useState('');
  const [CB, setCB] = useState('');
  const [SC, setSC] = useState('');
  const [SP, setSP] = useState('');
  const [BC, setBC] = useState('');
  const [LF, setLF] = useState('');
  const [PP_BTC, setPP_BTC] = useState(''); 
  const [Other, setOther] = useState(''); 
  const [selectedOperatorId, setSelectedOperatorId] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [operators, setOperators] = useState([]);
  const [models, setModels] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [operatorsRes, modelsRes] = await Promise.all([
          axios.get('/api/operators'),
          axios.get('/api/models'),
        ]);
        setOperators(operatorsRes.data);
        setModels(modelsRes.data);
      } catch (error) {
        console.error('Ошибка при загрузке операторов или моделей:', error);
        setErrorMessage('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const calculateCheck = () => {
      const values = [CB, SC, SP, BC, LF, PP_BTC, Other];
      const total = values.reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
      setCheck(total.toFixed(2));
    };

    calculateCheck();
  }, [CB, SC, SP, BC, LF, PP_BTC, Other]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!selectedDate || !selectedOperatorId || !selectedModelId) {
      setErrorMessage('Пожалуйста, заполните все обязательные поля.');
      return;
    }

    const formattedDate = selectedDate.split('T').join(' ');

    const shiftData = {
      date: formattedDate,
      check: parseFloat(check),
      CB: CB ? parseFloat(CB) : null,
      SC: SC ? parseFloat(SC) : null,
      SP: SP ? parseFloat(SP) : null,
      BC: BC ? parseFloat(BC) : null,
      LF: LF ? parseFloat(LF) : null,
      PP_BTC: PP_BTC ? parseFloat(PP_BTC) : null, 
      Other: Other || null,
      operatorId: parseInt(selectedOperatorId, 10),
      modelId: parseInt(selectedModelId, 10),
    };

    try {
      const response = await axios.post('/api/shifts', shiftData);
      console.log('Смена успешно добавлена:', response.data);
      setSelectedDate('');
      setCheck('');
      setCB('');
      setSC('');
      setSP('');
      setBC('');
      setLF('');
      setPP_BTC(''); 
      setOther('');
      setSelectedOperatorId('');
      setSelectedModelId('');
      alert('Смена успешно добавлена!');
    } catch (error) {
      console.error('Ошибка при добавлении смены:', error.response ? error.response.data : error.message);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Произошла ошибка при добавлении смены. Пожалуйста, попробуйте позже.');
      }
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-box">
        <h2>Добавить смену</h2>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <div>
          <label>Дата и время:</label>
          <input 
            type="datetime-local" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Чек:</label>
          <input type="number" step="0.01" value={check} readOnly />
        </div>
        <div>
          <label>CB:</label>
          <input type="number" step="0.01" value={CB} onChange={(e) => setCB(e.target.value)} />
        </div>
        <div>
          <label>SC:</label>
          <input type="number" step="0.01" value={SC} onChange={(e) => setSC(e.target.value)} />
        </div>
        <div>
          <label>SP:</label>
          <input type="number" step="0.01" value={SP} onChange={(e) => setSP(e.target.value)} />
        </div>
        <div>
          <label>BC:</label>
          <input type="number" step="0.01" value={BC} onChange={(e) => setBC(e.target.value)} />
        </div>
        <div>
          <label>LF:</label>
          <input type="number" step="0.01" value={LF} onChange={(e) => setLF(e.target.value)} />
        </div>
        <div>
          <label>PP_BTC:</label>
          <input type="number" step="0.01" value={PP_BTC} onChange={(e) => setPP_BTC(e.target.value)} />
        </div>
        <div>
          <label>Other:</label>
          <textarea value={Other} onChange={(e) => setOther(e.target.value)} />
        </div>
        <div>
          <label>Оператор:</label>
          <select value={selectedOperatorId} onChange={(e) => setSelectedOperatorId(e.target.value)} required>
            <option value="">Выберите оператора</option>
            {operators.map((operator) => (
              <option key={operator.id} value={operator.id}>
                {operator.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Модель:</label>
          <select value={selectedModelId} onChange={(e) => setSelectedModelId(e.target.value)} required>
            <option value="">Выберите модель</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Добавить смену</button>
      </form>
    </div>
  );
};

export default AddShiftForm;
