const BASE_URL = 'https://api.imats.se/';

const CATEGORIES_BALANCE = `${BASE_URL}compilation-service/compilation/categoriesbalance`;
const ACCOUNT_BALANCE = `${BASE_URL}compilation-service/compilation/accountbalances?type=`;

// periodType: 'monthly' or 'weekly'
// startDate, e.g. '2021-01-01'
// endDate, e.g. '2021-12-31'
const financialOverview = (periodType: string, startDate: string, endDate: string) => {
  return `${BASE_URL}compilation-service/compilation/${periodType}?startDate=${startDate}&endDate=${endDate}`;
};

export { CATEGORIES_BALANCE, ACCOUNT_BALANCE, financialOverview };
