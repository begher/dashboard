import axios from 'axios';
import { CATEGORIES_BALANCE } from './settings';

export const getCategoriesBalance = async () => {
  try {
    const response = await axios.get(CATEGORIES_BALANCE);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories balance', error);
  }
};
