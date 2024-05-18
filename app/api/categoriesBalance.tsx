import axios from 'axios';
import { CATEGORIES_BALANCE, ACCOUNT_BALANCE } from './settings';

type Category = {
  type: string;
  balance: number;
}[];

type CategoryResponse = Category | null;

export const getCategoriesBalance = async ({
  category = false,
}: { category?: string | false } = {}): Promise<CategoryResponse> => {
  try {
    const url = category ? `${ACCOUNT_BALANCE}${category}` : CATEGORIES_BALANCE;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories balance', error);
    return null;
  }
};
