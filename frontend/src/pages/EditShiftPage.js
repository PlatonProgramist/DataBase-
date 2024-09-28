import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditShiftPage.css'; // Подключаем CSS

const EditShiftPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [shift, setShift] = useState({
    date: '',
    modelId: '',
    operatorId: '',
    check: 0,
    CB: 0,
    SC: 0,
    SP: 0,
    BC: 0,
    LF: 0,
    PP_BTC: 0,
    Other: 0
  });

  const [operators, setOperators] = useState([]);
  const [models, setModels] = useState([]);

  useEffect(() => {
    const fetchShift = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/shifts/${id}`);
        if (response.data && response.data.date) {
          const formattedDate = response.data.date.replace(' ', 'T').slice(0, 16); // Форматируем дату
          setShift({ ...response.data, date: formattedDate });
        }
      } catch (error) {
        console.error('Error fetching shift:', error);
      }
    };

    const fetchOperators = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/operators');
        setOperators(response.data);
      } catch (error) {
        console.error('Error fetching operators:', error);
      }
    };

    const fetchModels = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/models');
        setModels(response.data);
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };

    fetchShift();
    fetchOperators();
    fetchModels();
  }, [id]);

  useEffect(() => {
    // Пересчет значения check при изменении полей CB, SC, SP, BC, LF, PP_BTC, Other
    const calculateCheck = () => {
      const { CB, SC, SP, BC, LF, PP_BTC, Other } = shift;
      const newCheck = Number(CB) + Number(SC) + Number(SP) + Number(BC) + Number(LF) + Number(PP_BTC) + Number(Other);
      setShift(prevShift => ({ ...prevShift, check: newCheck }));
    };

    calculateCheck();
  }, [shift]); // Добавляем shift в зависимости

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShift({ ...shift, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = shift.date.replace('T', ' ');
    const updatedShift = { ...shift, date: formattedDate };

    try {
      await axios.put(`http://localhost:5000/api/shifts/${id}`, updatedShift);
      navigate('/shifts');
    } catch (error) {
      console.error('Error updating shift:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/shifts/${id}`);
      navigate('/shifts');
    } catch (error) {
      console.error('Error deleting shift:', error);
    }
  };

  return (
    <div className="edit-shift">
      <h1>Edit Shift</h1>
      <form onSubmit={handleSubmit}>
        <label>Дата и время:</label>
        <input
          type="datetime-local"
          name="date"
          value={shift.date}
          onChange={handleInputChange}
          required
        />

        <label>Оператор:</label>
        <select name="operatorId" value={shift.operatorId} onChange={handleInputChange} required>
          <option value="">Выберите оператора</option>
          {operators.map((operator) => (
            <option key={operator.id} value={operator.id}>
              {operator.name}
            </option>
          ))}
        </select>

        <label>Модель:</label>
        <select name="modelId" value={shift.modelId} onChange={handleInputChange} required>
          <option value="">Выберите модель</option>
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>

        <label>Чек:</label>
        <input
          type="number"
          name="check"
          value={shift.check}
          placeholder="Check"
          onChange={handleInputChange}
          readOnly
        />

        <label>CB:</label>
        <input type="number" name="CB" value={shift.CB} placeholder="CB" onChange={handleInputChange} />

        <label>SC:</label>
        <input type="number" name="SC" value={shift.SC} placeholder="SC" onChange={handleInputChange} />

        <label>SP:</label>
        <input type="number" name="SP" value={shift.SP} placeholder="SP" onChange={handleInputChange} />

        <label>BC:</label>
        <input type="number" name="BC" value={shift.BC} placeholder="BC" onChange={handleInputChange} />

        <label>LF:</label>
        <input type="number" name="LF" value={shift.LF} placeholder="LF" onChange={handleInputChange} />

        <label>PP_BTC:</label>
        <input type="number" name="PP_BTC" value={shift.PP_BTC} placeholder="PP_BTC" onChange={handleInputChange} />

        <label>Other:</label>
        <textarea name="Other" value={shift.Other} placeholder="Other" onChange={handleInputChange} />

        <button type="submit">Save Changes</button>
      </form>
      <button onClick={handleDelete}>Delete Shift</button>
    </div>
  );
};

export default EditShiftPage;
