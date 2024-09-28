import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ShiftsTable from './pages/ShiftsTable';
import OperatorTable from './pages/OperatorTable';
import ModelTable from './pages/ModelTable';
import FanslyTable from './pages/FanslyTable';
import EditShiftPage from './pages/EditShiftPage';
import AddShiftPage from './pages/AddShiftPage';
import AddFanslyPage from './pages/AddFanslyPage'; // Добавление нового импорта
import StatisticsPage from './pages/StatisticsPage';
import AddOperatorPage from './pages/AddOperatorPage';
import AddModelPage from './pages/AddModelPage';
import RatingsPage from './pages/RatingPage'; // Импорт страницы рейтинга
import MonthlyEarningsPage from './pages/MonthlyEarningsPage'; // Импорт нового компонента
import Navbar from './components/Navbar';
import axios from 'axios';
import './App.css';

function App() {
  const [statisticsData, setStatisticsData] = useState([]);

  useEffect(() => {
    const fetchStatisticsData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/statistics');
        setStatisticsData(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных статистики:', error);
      }
    };

    fetchStatisticsData();
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/shifts" element={<ShiftsTable />} />
        <Route path="/operators" element={<OperatorTable />} />
        <Route path="/models" element={<ModelTable />} />
        <Route path="/fansly" element={<FanslyTable />} />
        <Route path="/shift/add" element={<AddShiftPage />} />
        <Route path="/shift/edit/:id" element={<EditShiftPage />} />
        <Route path="/fansly/add" element={<AddFanslyPage />} />
        <Route path="/statistics" element={<StatisticsPage data={statisticsData} />} />
        <Route path="/operator/add" element={<AddOperatorPage />} />
        <Route path="/model/add" element={<AddModelPage />} />
        <Route path="/ratings" element={<RatingsPage />} /> {/* Добавлен маршрут для рейтингов */}
        <Route path="/monthly-earnings" element={<MonthlyEarningsPage />} /> {/* Добавлен маршрут для ежемесячного заработка */}
      </Routes>
    </Router>
  );
}

export default App;
