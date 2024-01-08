import axios from 'axios';
import { useState, useEffect } from 'react';
import PieChart from '../PieChart';
import "./pieData.css"

const AllUsers = async (setPieData) => {
  try {
    const response = await axios.get(`https://cpdbackend.onrender.com/users`);
    const users = response.data;
    console.log('Users:', users);

    // Calculate the count of active users
    const activeCount = users.filter((user) => user.isActive).length;
    const pending = users.filter((user) => user.status === 'pending').length;
    console.log('Active Count:', activeCount);
    console.log('pending Count:', pending);

    // Update the pie chart data
    setPieData([
      {
        id: 'Deactive',
        label: `Deactive [${users.length - activeCount}]`,
        value: users.length - activeCount,
        color: 'red', // Set the color to red
      },
      {
        id: 'Active',
        label: `Active [${activeCount}]`,
        value: activeCount,
        color: 'green', // Set the color to green
      },
      {
        id: 'Pending',
        label: `Pending [${pending}]`,
        value: pending,
        color: 'yellow',
      },
    ]);


  } catch (error) {
    console.error(error);
  }
};

const AllCourses = async (setPieData2) => {
  try {
    const response = await axios.get(`https://cpdbackend.onrender.com/users`);
    const users = response.data;
    console.log('Users:', users);

    // Calculate the count of active users
    const pending = users.filter((user) => user.status === 'pending').length;
    console.log('pending Count:', pending);

    const response2 = await axios.get(`https://cpdbackend.onrender.com/admin/courses`);
    const courses = response2.data;
    console.log('Users:', courses);

    // Calculate the count of active users
    const pendingC = courses.filter((course) => course.status === 'pending').length;
    console.log('pending Count:', pendingC);

    const response3 = await axios.get(`https://cpdbackend.onrender.com/addcpds/pending`);
    const cpd = response3.data;
    // console.log('Users:', cpd);

    // Calculate the count of active users
    // const pendingCpd = cpd.filter((cpd) => cpd.status === 'pending').length;
    console.log('pending cpd Count:', cpd.length);


    // Update the pie chart data

    setPieData2([
      {
        id: 'Pending',
        label: `Pending user[${pending}]`,
        value: pending,
        color: 'yellow',
      },
      {
        id: 'Active',
        label: `Pending Courses[${pendingC}]`,
        value: pendingC,
        color: 'red',
      },
      {
        id: 'Deactive',
        label: `Pending CPD[${cpd.length}]`,
        value: cpd.length,
        color: 'green',
      },
    ]);
  } catch (error) {
    console.error(error);
  }
};

const PieChartComponent = () => {
  const [pieData, setPieData] = useState([]);
  const [pieData2, setPieData2] = useState([]);

  useEffect(() => {
    AllUsers(setPieData);
    AllCourses(setPieData2);
  }, []);

  // Render the pie chart using the updated pieData
  return (
    <>
       <div className="chartContainer">
        <PieChart data={pieData} />
        <PieChart data={pieData2} />
       </div>
    </>
  );
};

export default PieChartComponent;
