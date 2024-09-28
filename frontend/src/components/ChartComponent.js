import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const ChartComponent = ({ shifts }) => {
  if (!shifts || shifts.length === 0) {
    return <div>Нет данных для отображения</div>;
  }

  const data = {
    labels: shifts.map(shift => new Date(shift.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Check',
        data: shifts.map(shift => shift.check),
        borderColor: 'blue',
        fill: false,
      },
      {
        label: 'CB',
        data: shifts.map(shift => shift.CB),
        borderColor: 'green',
        fill: false,
      },
      {
        label: 'SC',
        data: shifts.map(shift => shift.SC),
        borderColor: 'red',
        fill: false,
      },
      {
        label: 'SP',
        data: shifts.map(shift => shift.SP),
        borderColor: 'purple',
        fill: false,
      },
      {
        label: 'BC',
        data: shifts.map(shift => shift.BC),
        borderColor: 'orange',
        fill: false,
      },
      {
        label: 'LF',
        data: shifts.map(shift => shift.LF),
        borderColor: 'pink',
        fill: false,
      },
      {
        label: 'PP_BTC',  // Новый набор данных
        data: shifts.map(shift => shift.PP_BTC),
        borderColor: 'cyan',
        fill: false,
      },
      {
        label: 'Other',  // Новый набор данных
        data: shifts.map(shift => shift.Other),
        borderColor: 'magenta',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Дата',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Значения',
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default ChartComponent;
