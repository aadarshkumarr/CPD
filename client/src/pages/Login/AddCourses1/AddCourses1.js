import React, { useEffect, useState } from 'react';
import './AddCourses1.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { CToast, CToastBody, CToastClose } from '@coreui/react';

import logo from '../../../assets/logo-removebg-preview__2_-removebg-preview.png';

const AddCourses1 = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseData, setCourseData] = useState([]);
  const [show, setShow] = useState(false);

  const handlePay = () => {
    setShow(true);
  };

  useEffect(() => {
    // Fetch course data from API or set dummy data
    const fetchCourseData = async () => {
      try {
        const response = await axios.get('API_ENDPOINT');
        setCourseData(response.data);
      } catch (error) {
        console.error(error);
        // Set dummy course data if API request fails
        setCourseData([
          {
            _id: '1',
            courseName: 'Dummy Course 1',
            courseImg: '../../../assets/dummy-course-1.jpg',
          },
          {
            _id: '2',
            courseName: 'Dummy Course 2',
            courseImg: '../../../assets/dummy-course-2.jpg',
          },
          {
            _id: '3',
            courseName: 'Dummy Course 3',
            courseImg: '../../../assets/dummy-course-3.jpg',
          },
        ]);
      }
    };

    fetchCourseData();
  }, []);

  const handleCourseChange = (event) => {
    const selectedCourseId = event.target.value;
    const selectedCourse = courseData.find((course) => course._id === selectedCourseId);
    setSelectedCourse(selectedCourse);
  };

  return (
    <div className="course_main">
      <img className="add_course_logo" src={logo} alt="" />
      {show && (
        <CToast visible color="success" className="text-white align-items-center">
          <div className="d-flex">
            <CToastBody className="ml-4">
              Your account Successfully created with this course. Please wait for Admin Approval. You will get a email
              regarding approval. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              <Link to="/login" className="link_login">
                Login
              </Link>
            </CToastBody>
            <CToastClose className="me-2 m-auto" white />
          </div>
        </CToast>
      )}
      <div className="course_section">
        <form className="add_course_form">
          <h4 className="labelss">Course:</h4>
          <select
            className="addCourse-input"
            id="qualifyingActivity"
            value={selectedCourse ? selectedCourse._id : ''}
            onChange={handleCourseChange}
          >
            <option value="">Courses</option>
            {courseData.map((course) => (
              <option key={course._id} value={course._id}>
                {course.courseName}
              </option>
            ))}
          </select>
          {selectedCourse && (
            <>
              <div className="course">
                <img src={selectedCourse.courseImg} width={200} height={200} alt="" />
                <h4>{selectedCourse.courseName}</h4>
              </div>
            </>
          )}
        </form>
      </div>
      <button className="add-course-btn" onClick={handlePay}>
        Pay Now
      </button>
    </div>
  );
};

export default AddCourses1;
