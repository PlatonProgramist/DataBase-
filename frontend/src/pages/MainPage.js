import React, { useEffect, useState, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import axios from 'axios';
import './MainPage.css';

// Регистрация компонентов Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const MainPage = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [dailyEarnings, setDailyEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      // Запрашиваем общий доход
      const incomeResponse = await axios.get('/api/statistics');
      if (incomeResponse.data && incomeResponse.data.length > 0) {
        const total = incomeResponse.data.reduce((sum, shift) => sum + (shift.check || 0), 0);
        setTotalIncome(total);
      } else {
        setTotalIncome(0);
      }

      // Запрашиваем доходы по дням
      const earningsResponse = await axios.get('/api/earnings/daily');
      console.log('Earnings Response:', earningsResponse.data); // Отладочный вывод

      if (Array.isArray(earningsResponse.data)) {
        setDailyEarnings(earningsResponse.data);
      } else {
        setDailyEarnings([]);
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      setTotalIncome(0);
      setDailyEarnings([]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Реверсируем данные для графика
  const reversedEarnings = dailyEarnings.slice().reverse();

  const chartData = {
    labels: reversedEarnings.map(e => e.date),
    datasets: [
      {
        label: 'Ежедневный доход',
        data: reversedEarnings.map(e => e.totalCheck || 0),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="main-page-container">
      <h1 className="total-income-header">Общий доход: ${totalIncome ? totalIncome.toFixed(2) : '0.00'}</h1>

      <div className="chart-fullscreen">
        {loading ? (
          <p>Загрузка данных...</p>
        ) : dailyEarnings.length > 0 ? (
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        ) : (
          <p>Нет данных для отображения графика</p>
        )}
      </div>
    </div>
  );
};

export default MainPage;
