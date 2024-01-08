import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CourseHistory.css';

const CourseHistory = () => {
  const [CPD, setCPD] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2023'); // Default selected year
  const user = localStorage.getItem('user');
  const userParse = JSON.parse(user);
  const registrationId = userParse._id;

  console.log(CPD, 'cpd');

  useEffect(() => {
    async function fetchCPD() {
      try {
        const res = await axios.get(`https://cpdbackend.onrender.com/getcpd/${registrationId}`);
        setCPD(res.data.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchCPD();
  }, [registrationId]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const filteredData = CPD.filter((hours) => {
    const courseStartDate = new Date(hours.startDate);
    const courseEndDate = new Date(hours.endDate);
    return (
      courseStartDate.getFullYear().toString() === selectedYear ||
      courseEndDate.getFullYear().toString() === selectedYear
    );
  });

  const totalHours = filteredData.reduce((accumulator, currentObject) => accumulator + currentObject.hours, 0);

  return (
    <div className="courseHistory">
      <h1 className="heading_history">Your Past Cycle</h1>
      <div className="filters">
        <select id="yearSelect" value={selectedYear} onChange={handleYearChange}>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          {/* Add more years as needed */}
        </select>
        <h5 className="label" htmlFor="yearSelect">
          Select Year:
        </h5>
      </div>

      {filteredData.length > 0 ? (
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Earned Hours</th>
                <th>Required Hours</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((course) => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>{course.hours}</td>
                  <td>20 hrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No history found for the selected year.</p>
      )}
    </div>
  );
};

export default CourseHistory;
