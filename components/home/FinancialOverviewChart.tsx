'use client';

import { getFinancialOverview } from '@/api/financialOverview';
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type FinancialData =
  | {
      date: string;
      income: number;
      outcome: number;
    }[]
  | null;

const FinancialOverviewChart = () => {
  const [financialData, setFinancialData] = useState<FinancialData>(null);
  const [periodType, setPeriodType] = useState<string>('monthly');
  const [startDate, setStartDate] = useState<string>('2023-01-01');
  const [endDate, setEndDate] = useState<string>('2024-01-01');
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 640);

  useEffect(() => {
    getFinancialOverview(periodType, startDate, endDate).then((data) => {
      console.log('financial data', data);
      setFinancialData(data);
    });
  }, [periodType, startDate, endDate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const updateMedia = () => {
    setIsMobile(window.innerWidth < 640);
  };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  const data = {
    labels: financialData
      ? isMobile
        ? financialData.map((_) => ``)
        : financialData.map((item) => formatDate(item.date))
      : [],
    datasets: [
      {
        label: 'Income',
        data: financialData ? financialData.map((item) => item.income) : [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Outcome',
        data: financialData ? financialData.map((item) => item.outcome) : [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || '';
            const value = context.raw;
            const date = context.label;
            return `${label}: ${value} ${!isMobile ? `Date: ${new Date(date).toLocaleDateString()}` : ''}`;
          },
        },
      },
    },
    scales: {
      y: {
        display: !isMobile,
      },
    },
  };

  const totalIncome = financialData ? financialData.reduce((acc, item) => acc + item.income, 0) : 0;
  const totalOutcome = financialData
    ? financialData.reduce((acc, item) => acc + item.outcome, 0)
    : 0;

  return (
    <div className='max-w-5xl mx-auto'>
      <div className='w-full p-8 rounded-md'>
        {!financialData ? (
          <div>Loading...</div>
        ) : (
          <div className='max-w-5xl mx-auto'>
            <div className='flex justify-between sm:pb-10 pb-4 flex-wrap gap-y-4'>
              <div className='flex items-center'>
                <span className='text-2xl font-bold truncate'>Financial Overview</span>
              </div>
              <div className='flex items-center flex-wrap gap-2'>
                <select
                  className='p-2 border border-gray-300 rounded-md w-full xs:w-auto'
                  value={periodType}
                  onChange={(e) => setPeriodType(e.target.value)}
                >
                  <option value='monthly'>Monthly</option>
                  <option value='weekly'>Weekly</option>
                </select>
                <input
                  type='date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className='p-2 border border-gray-300 rounded-md w-full xs:w-auto'
                />
                <input
                  type='date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className='p-2 border border-gray-300 rounded-md w-full xs:w-auto'
                />
              </div>
            </div>
            <Line data={data} options={options} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialOverviewChart;
