import CatagoryGraph from '../../components/home/CatagoryGraph';
import FinancialOverviewChart from '../../components/home/FinancialOverviewChart';

export default function Home() {
  return (
    <main className=' '>
      <FinancialOverviewChart />
      <CatagoryGraph />
    </main>
  );
}
