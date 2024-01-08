import { useTheme } from '@mui/material/styles';

import PieChartComponent from './pie/data/pieData';

// ----------------------------------------------------------------------

function Management() {
  const theme = useTheme();

  return (
    <>
      <PieChartComponent />
    </>
  );
}

export default Management;
