import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function EmissionsTrendChart({ trendData, timeRange }) {
  const labels = Object.keys(trendData);
  const values = Object.values(trendData);

  const data = {
    labels,
    datasets: [
      {
        label: 'CO2 Emissions (kg)',
        data: values,
        fill: true,
        backgroundColor: 'rgba(13, 242, 108, 0.1)',
        borderColor: '#0DF26C',
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#0DF26C',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `${context.parsed.y.toFixed(2)} kg CO2e`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 11
          },
          callback: function(value) {
            return value + ' kg';
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 11
          },
          maxTicksLimit: timeRange === 'week' ? 7 : timeRange === 'month' ? 15 : 12,
          callback: function(value, index) {
            const label = this.getLabelForValue(value);
            if (timeRange === 'week') {
              // Show day name for week view
              const date = new Date(label);
              return date.toLocaleDateString('en-US', { weekday: 'short' });
            } else if (timeRange === 'month') {
              // Show day number for month view
              const date = new Date(label);
              return date.getDate();
            } else {
              // Show month name for year view
              const date = new Date(label);
              return date.toLocaleDateString('en-US', { month: 'short' });
            }
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return <Line data={data} options={options} />;
}
