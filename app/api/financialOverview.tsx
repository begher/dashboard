import axios from 'axios';
import { financialOverview } from './settings';

export const getFinancialOverview = async (
  periodType: string,
  startDate: string,
  endDate: string
) => {
  try {
    const url = financialOverview(periodType, startDate, endDate);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching financial overview', error);
    return null;
  }
};
