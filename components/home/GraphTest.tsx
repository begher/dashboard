'use client';

import { useState, useEffect } from 'react';
import { getCategoriesBalance } from '@/api/categoriesBalance';
import { FaArrowLeftLong } from 'react-icons/fa6';

type Category =
  | {
      type: string;
      balance: number;
    }[]
  | null;

const GraphTest = () => {
  const [categories, setCategories] = useState<Category>([]);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>('');

  const formatBalance = (balance: number): string => {
    if (balance < 1 && balance > 0) {
      balance = 1;
    } else {
      balance = Math.round(balance);
    }

    return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  useEffect(() => {
    getCategoriesBalance().then((data) => {
      console.log(data);
      setCategories(data);
    });
  }, []);

  function calculateBarLength(balance: number) {
    if (!categories) return 0;
    const maxBalance = Math.max(...categories.map((category) => category.balance));
    return (balance / maxBalance) * 100;
  }

  const sortedBalance = categories?.sort((a, b) => b.balance - a.balance);

  function handleClick(type?: string) {
    if (!isSelected) {
      setSelectedCategory(type);
      getCategoriesBalance({ category: type }).then((data) => {
        console.log('dataaaa', data);

        setCategories(data);
      });
      setIsSelected(true);
    } else {
      getCategoriesBalance().then((data) => {
        setCategories(data);
        setSelectedCategory(undefined);
      });
      setIsSelected(false);
    }
  }

  return (
    <div className='w-full p-8 rounded-md'>
      {!sortedBalance ? (
        <div>Loading...</div>
      ) : (
        <div className='max-w-5xl mx-auto'>
          <div className='flex items-center justify-between'>
            <div className='text-2xl font-bold'>
              {isSelected ? `${selectedCategory}` : 'Categories'}
            </div>
            {isSelected && (
              <button
                onClick={() => {
                  setIsSelected(false);
                  handleClick();
                }}
                className='flex items-center space-x-2 text-sm font-medium text-emerald-500'
              >
                <FaArrowLeftLong />
                <span>Back</span>
              </button>
            )}
          </div>
          {sortedBalance.map((category) => (
            <div key={category.type}>
              <div className='mb-1 mt-4 tracking-wide'>{category.type}</div>
              <button
                onClick={() => {
                  if (isSelected) return;
                  handleClick(category.type);
                }}
                className={`h-20 rounded-r-lg bg-gradient-to-r text-left from-emerald-500 z-20 to-emerald-300 relative before:top-0 before:right-0 before:bottom-0 
                before:left-0 before:absolute before:content-[""] before:transition before:-z-10  before:duration-500 before:opacity-0  
                before:bg-emerald-500 before:ring-2 before:ring-black before:rounded-r-lg ${!isSelected ? 'hover:before:opacity-100' : 'cursor-default'}`}
                style={{ width: `${calculateBarLength(category.balance)}%` }}
              >
                <span className='truncate text-sm font-medium leading-[80px] pl-4 pointer-events-none'>
                  {formatBalance(category.balance)} kr
                </span>
                {/* <div className='absolute w-full h-full left-0 right-0 top-0 bottom-0 bg-black z-30'></div> */}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GraphTest;
