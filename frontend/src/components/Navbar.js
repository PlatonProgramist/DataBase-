import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li><Link to="/">Главная</Link></li>
        <li><Link to="/shifts">Смены</Link></li>
        <li><Link to="/operators">Операторы</Link></li>
        <li><Link to="/models">Модели</Link></li>
        <li><Link to="/fansly">Fansly</Link></li>
        <li><Link to="/shift/add">Добавить смену</Link></li>
        <li><Link to="/operator/add">Добавить оператора</Link></li>
        <li><Link to="/model/add">Добавить модель</Link></li>
        <li><Link to="/statistics">Статистика</Link></li>
        <li><Link to="/ratings">Рейтинг</Link></li>
        <li><Link to="/monthly-earnings">Ежемесячный заработок</Link></li> {/* Добавлена ссылка на страницу ежемесячного заработка */}
      </ul>
    </nav>
  );
};

export default Navbar;
