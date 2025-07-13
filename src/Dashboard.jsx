import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const Dashboard = () => {
  const [summary, setSummary] = useState({});
  const [sales, setSales] = useState([]);

  useEffect(() => {
    axios.get('https://pos-backend-m1qe.onrender.com/api/sales-summary')
      .then(res => setSummary(res.data))
      .catch(console.error);
    axios.get('https://pos-backend-m1qe.onrender.com/api/sales')
      .then(res => setSales(res.data))
      .catch(console.error);
  }, []);

  const labels = sales.map(s => new Date(s.date_time).toLocaleString());
  const data = sales.map(s => s.total_price);

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>
      <p>Total Sales: {summary.total_transactions}</p>
      <p>Total Revenue: Ksh {summary.total_revenue}</p>
      <Bar data={{ labels, datasets: [{ label: 'Sale Value', data }] }} />
    </div>
  );
};

export default Dashboard;
