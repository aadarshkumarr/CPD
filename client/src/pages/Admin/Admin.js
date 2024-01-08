import { useTheme } from '@mui/material/styles';

import PieChartComponent from './pie/data/pieData';

// ----------------------------------------------------------------------

function Admin() {
  const theme = useTheme();

  return (
    <>
      <PieChartComponent />
    </>
  );
}

export default Admin;
