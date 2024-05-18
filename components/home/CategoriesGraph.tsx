'use client';

import { getCategoriesBalance } from '@/api/categoriesBalance';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
  ChartArea,
  ScriptableContext,
} from 'chart.js';

type Category = {
  type: string;
  balance: number;
}[];

const CategoriesGraph = () => {
  const [categories, setCategories] = useState<Category>([]);

  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

  const options = {
    indexAxis: 'y' as const,

    responsive: true,
    maintainAspectRatio: false,

    scales: {
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    dataset: {
      bar: {},
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            weight: 700,
          },
        },
      },
      title: {
        display: true,
        text: 'Översikt av kategorier',
      },

      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += `${context.raw} kr`;
            return label;
          },
        },
      },
    },
  };

  const labels = categories.map((category) => category.type);

  const createGradient = (ctx: CanvasRenderingContext2D, chartArea: ChartArea, value: number) => {
    const gradient = ctx.createLinearGradient(0, 0, chartArea.width, 0);
    if (value > 0) {
      gradient.addColorStop(0, 'rgba(134, 207, 170, 1)');
      gradient.addColorStop(1, 'rgba(1, 134, 102, 1)');
    } else {
      gradient.addColorStop(0, 'rgba(0, 0, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(128, 0, 128, 0.9)');
    }
    return gradient;
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Balance',
        borderRadius: 10,
        data: categories.map((category) => category.balance),
        backgroundColor: function (context: ScriptableContext<'bar'>): CanvasGradient {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            // This case happens on initial chart load
            return ctx.createLinearGradient(0, 0, 0, 0);
          }

          return createGradient(ctx, chartArea, context.raw as number);
        },
      },
    ],
  };

  useEffect(() => {
    getCategoriesBalance().then((data) => {
      console.log(data);
      setCategories(data);
    });
  }, []);

  return (
    <div className='w-full h-[calc(100vh-160px)] pb-8'>
      <Bar width={100} height={100} data={data} options={options} />
    </div>
  );
};
export default CategoriesGraph;
