import { ResponsivePie } from '@nivo/pie';

import { useEffect, useState } from 'react';
import { red } from '@mui/material/colors';

import ApproveUser from '../ApproveUser';

const PieChart = ({ data }) => {
  const [users, setusers] = useState([]);

  const fetchUser = async () => {
    try {
      const response = await fetch('https://cpdbackend.onrender.com/users');
      const users = await response.json();
      setusers(users);
      console.log(users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const centerLabelComponent = () => (
    <g transform={`translate(0, 0)`}>
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: '18px',
          fontWeight: 'bold',
        }}
      >
        Total Users: {users.length}
      </text>
    </g>
  );
  const colors = {
    active: 'green', // Set the color for active slice
    deactive: 'red',
    pending: 'yellow',
    user: 'violet',
    cpd: 'blue',
    courses: 'aqua',
  };
  return (
    <>
      <ResponsivePie
        width={600} // Decrease the width as needed
        height={500}
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        enableArcLabels={false}
        arcLabelsRadiusOffset={0.4}
        arcLabelsSkipAngle={7}
        arcLabelsTextColor={{
          from: 'color',
          modifiers: [['darker', 2]],
        }}
        colors={({ id }) => colors[id.toLowerCase()]} // Set colors based on the slice id
        defs={[
          {
            id: 'dots',
            type: 'patternDots',
            background: 'inherit',
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: '#999',
            itemDirection: 'left-to-right',
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000',
                },
              },
            ],
          },
        ]}
        layers={['arcs', 'arcLabels', 'arcLinkLabels', 'legends', centerLabelComponent]}
      />
    </>
  );
};

export default PieChart;
