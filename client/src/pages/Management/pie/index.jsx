import { Box } from '@mui/material';
import PieChart from './PieChart';

const Pie = () => {
  return (
    <Box m="20px">
      <Box height="60vh" display="flex" flexDirection="row">
        <div style={{ flex: 1 }}>
          <PieChart />
        </div>
      </Box>
    </Box>
  );
};

export default Pie;
