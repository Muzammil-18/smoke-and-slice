import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export function MonthlyRevenueChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: 'Monthly Revenue ($)',
        data: data.map((d) => d.revenue),
        borderColor: '#FF3838',
        backgroundColor: 'rgba(255, 56, 56, 0.15)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#FF3838',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { grid: { color: '#262626' }, ticks: { color: '#A3A3A3' } },
      x: { grid: { display: false }, ticks: { color: '#A3A3A3' } },
    },
  };

  return (
    <div className="h-64 sm:h-80 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}

export function OrdersChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: 'Orders',
        data: data.map((d) => d.count),
        backgroundColor: '#FF5E5E',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { grid: { color: '#262626' }, ticks: { color: '#A3A3A3' } },
      x: { grid: { display: false }, ticks: { color: '#A3A3A3' } },
    },
  };

  return (
    <div className="h-64 sm:h-80 w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}

export function CategorySalesChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: [
          '#FF3838',
          '#FF5E5E',
          '#F59E0B',
          '#10B981',
          '#3B82F6',
          '#8B5CF6',
        ],
        borderWidth: 1,
        borderColor: '#1C1C1E',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#A3A3A3', boxWidth: 12, font: { size: 11 } },
      },
    },
  };

  return (
    <div className="h-64 w-full flex items-center justify-center">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

export function TopProductsChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        label: 'Quantity Sold',
        data: data.map((d) => d.qty),
        backgroundColor: '#3B82F6',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { color: '#262626' }, ticks: { color: '#A3A3A3' } },
      y: { grid: { display: false }, ticks: { color: '#A3A3A3' } },
    },
  };

  return (
    <div className="h-64 sm:h-80 w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}
