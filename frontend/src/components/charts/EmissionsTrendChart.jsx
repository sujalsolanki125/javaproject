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

  // Find the maximum value to highlight peaks
  const maxValue = Math.max(...values);
  const avgValue = values.reduce((a, b) => a + b, 0) / values.length;

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
        pointRadius: values.map(v => v === maxValue ? 8 : v > avgValue ? 5 : 4), // Larger point for peak
        pointBackgroundColor: values.map(v => v === maxValue ? '#FF6B6B' : '#0DF26C'), // Red for peak
        pointBorderColor: values.map(v => v === maxValue ? '#fff' : '#0DF26C'),
        pointBorderWidth: values.map(v => v === maxValue ? 3 : 0),
        pointHoverRadius: 10,
        pointHoverBackgroundColor: values.map(v => v === maxValue ? '#FF6B6B' : '#0DF26C'),
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3,
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
          title: function(context) {
            const label = context[0].label;
            if (timeRange === 'day') {
              // For hourly view, show time
              const date = new Date(label);
              return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            }
            return label;
          },
          label: function(context) {
            const value = context.parsed.y;
            const isPeak = value === maxValue;
            const peakLabel = isPeak ? ' 🔥 PEAK' : '';
            return `${value.toFixed(2)} kg CO2e${peakLabel}`;
          },
          afterLabel: function(context) {
            const value = context.parsed.y;
            if (value === maxValue) {
              return 'Highest emission point';
            } else if (value > avgValue * 1.5) {
              return 'Above average';
            }
            return '';
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
          maxTicksLimit: timeRange === 'day' ? 24 : timeRange === 'week' ? 7 : timeRange === 'month' ? 15 : 12,
          callback: function(value, index) {
            const label = this.getLabelForValue(value);
            if (timeRange === 'day') {
              // Show hour for day view
              const date = new Date(label);
              return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
            } else if (timeRange === 'week') {
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
