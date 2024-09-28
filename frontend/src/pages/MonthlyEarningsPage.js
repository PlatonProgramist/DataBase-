import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Регистрация необходимых компонентов
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const MonthlyEarningsPage = () => {
  const [shifts, setShifts] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [averageShifts, setAverageShifts] = useState(0);
  const [dailyEarnings, setDailyEarnings] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // формат YYYY-MM

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/shifts/month?month=${selectedMonth}`);
        const shiftsData = response.data;

        if (shiftsData && shiftsData.length) {
          setShifts(shiftsData);

          // Общий заработок и количество смен за месяц
          const total = shiftsData.reduce((sum, shift) => sum + shift.check, 0);
          setTotalEarnings(total);

          // Среднее количество смен
          setAverageShifts(shiftsData.length ? (total / shiftsData.length) : 0);

          // Суммируем заработок и количество смен за каждый день
          const dailyEarningsMap = shiftsData.reduce((acc, shift) => {
            const date = new Date(shift.date).toISOString().split('T')[0];
            if (!acc[date]) {
              acc[date] = { totalCheck: 0, count: 0 };
            }
            acc[date].totalCheck += shift.check;
            acc[date].count += 1; // Увеличиваем счетчик смен
            return acc;
          }, {});

          const dailyEarningsData = Object.keys(dailyEarningsMap).map(date => ({
            date,
            totalCheck: dailyEarningsMap[date].totalCheck,
            count: dailyEarningsMap[date].count, // Добавляем количество смен
          }));

          setDailyEarnings(dailyEarningsData);
        } else {
          setShifts([]);
          setTotalEarnings(0);
          setAverageShifts(0);
          setDailyEarnings([]);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, [selectedMonth]);

  // Обработка изменения выбранного месяца
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // Проверяем, есть ли данные
  if (!shifts || !shifts.length) {
    return <div>Загрузка данных...</div>;
  }

  const chartData = {
    labels: dailyEarnings.map(item => item.date),
    datasets: [
      {
        label: 'Заработок за день',
        data: dailyEarnings.map(item => item.totalCheck),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0].label; // Дата
          },
          label: (tooltipItem) => {
            const value = tooltipItem.raw;
            return `Заработок: ${value}`; // Только заработок
          },
          afterLabel: (tooltipItem) => {
            const dailyData = dailyEarnings[tooltipItem.dataIndex];
            return `Количество смен: ${dailyData.count}`; // Количество смен
          }
        }
      }
    }
  };

  return (
    <div>
      <h1>Статистика за месяц</h1>
      
      <div>
        <label htmlFor="month">Выбрать месяц: </label>
        <input 
          type="month" 
          id="month" 
          value={selectedMonth} 
          onChange={handleMonthChange} 
        />
      </div>

      <p>Количество смен за месяц: {shifts.length}</p>
      <p>Общий заработок за месяц: {totalEarnings}</p>
      <p>Средний заработок за смену: {averageShifts.toFixed(2)}</p>

      <div>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MonthlyEarningsPage;
