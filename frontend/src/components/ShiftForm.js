import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShiftForm = ({ shift, onSubmit, onChange }) => {
  const [models, setModels] = useState([]);
  const [operators, setOperators] = useState([]);

  useEffect(() => {
    const fetchModelsAndOperators = async () => {
      const [modelsResponse, operatorsResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/models'),
        axios.get('http://localhost:5000/api/operators'),
      ]);
      setModels(modelsResponse.data);
      setOperators(operatorsResponse.data);
    };
    fetchModelsAndOperators();
  }, []);

  return (
    <form onSubmit={onSubmit} className="shift-form">
      <label>Date:
        <input
          type="date"
          name="date"
          value={shift.date}
          onChange={onChange}
        />
      </label>

      <label>Model:
        <select
          name="modelId"
          value={shift.modelId}
          onChange={onChange}
        >
          <option value="">Select Model</option>
          {models.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </label>

      <label>Operator:
        <select
          name="operatorId"
          value={shift.operatorId}
          onChange={onChange}
        >
          <option value="">Select Operator</option>
          {operators.map(operator => (
            <option key={operator.id} value={operator.id}>
              {operator.name}
            </option>
          ))}
        </select>
      </label>

      <label>Check:
        <input
          type="number"
          name="check"
          value={shift.check}
          onChange={onChange}
        />
      </label>

      <label>CB:
        <input
          type="number"
          name="CB"
          value={shift.CB}
          onChange={onChange}
        />
      </label>

      <label>SC:
        <input
          type="number"
          name="SC"
          value={shift.SC}
          onChange={onChange}
        />
      </label>

      <label>SP:
        <input
          type="number"
          name="SP"
          value={shift.SP}
          onChange={onChange}
        />
      </label>

      <label>BC:
        <input
          type="number"
          name="BC"
          value={shift.BC}
          onChange={onChange}
        />
      </label>

      <label>LF:
        <input
          type="number"
          name="LF"
          value={shift.LF}
          onChange={onChange}
        />
      </label>

      {/* Новые поля */}
      <label>PP_BTC:
        <input
          type="number"
          name="PP_BTC"
          value={shift.PP_BTC}
          onChange={onChange}
        />
      </label>

      <label>Other:
        <textarea
          name="Other"
          value={shift.Other}
          onChange={onChange}
        />
      </label>

      <button type="submit">Save</button>
    </form>
  );
};

export default ShiftForm;
