import React, { useEffect, useState } from 'react';
import './AddCourses.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CToast, CToastBody, CToastClose } from '@coreui/react';
import { Alert } from '@mui/material';

const AddCourses = () => {
  const [certificateId, setCertificateId] = useState('');
  const [courseData, setCourseData] = useState([]);
  const [show, setShow] = useState(false);
  const [file, setFile] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [alert, setAlert] = useState(null);

  const user = localStorage.getItem('user');
  const userParse = JSON.parse(user);
  const userId = userParse._id;
  const username = userParse.name;
  const email = userParse.email;

  const navigate = useNavigate();

  // console.log(courseData);
  useEffect(() => {
    async function fetchCPD() {
      try {
        const res = await axios.get('https://cpdbackend.onrender.com/admin/courses');
        const coursesWithImages = res.data.map((course) => ({
          ...course,
          courseImg: `https://cpdbackend.onrender.com/uploads/${course.filename}`,
        }));
        console.log('Fetched Courses with Images:', coursesWithImages);
        setCourseData(coursesWithImages);
      } catch (err) {
        console.log(err);
      }
    }
    fetchCPD();
  }, []);

  // Function to handle course selection and update the selectedCourseId state
  const handleCourseSelection = (event) => {
    setSelectedCourseId(event.target.value);
    console.log('Selected Course ID:', event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedCourseId) {
      console.error('Selected course not found.');
      return;
    }

    const selectedCourse = courseData.find((course) => course._id === selectedCourseId);

    if (!selectedCourse) {
      console.error('Selected course not found in courseData.');
      return;
    }

    console.log('Selected Course:', selectedCourse);

    const data = {
      certificateId: parseInt(certificateId, 10),
      courseName: selectedCourse.courseName,
    };

    const formData = new FormData();
    formData.append('certificateId', data.certificateId);
    formData.append('courseName', data.courseName);

    // Append the username and email fields to the formData
    formData.append('username', username);
    formData.append('email', email);

    // Append the courseImg file to the formData
    // formData.append('courseImg', selectedCourse.courseImg);

    formData.append('certificatePDF', file);

    const baseUrl = `https://cpdbackend.onrender.com/addcourse/${userId}`;

    try {
      const response = await axios.post(baseUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
      setAlert(<Alert severity="success">Course added Successfully</Alert>);
      setCertificateId('');
      setFile(null);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error(error);
      setAlert(<Alert severity="error">{error.message}</Alert>);
    }
  };

  // useEffect(() => {
  //   let timeout;
  //   if (show) {
  //     timeout = setTimeout(() => {
  //       setShow(false);
  //       navigate('/');
  //     }, 3000);
  //   }
  //   return () => clearTimeout(timeout);
  // }, [show]);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: '1000',
          width: '80%',
          maxWidth: '400px',
        }}
      >
        {alert}
      </div>
      <div className="main_container">
        <div className="">
          <div className="brand-title">Add Courses</div>

          <div className="inputss">
            <p className="required_p">*All fields Required</p>
            <form onSubmit={handleSubmit}>
              <h4 className="labelss">
                Course: <span className="required_asterisk">*</span>
              </h4>
              <select className="login-form-input" id="qualifyingActivity" onChange={handleCourseSelection}>
                {courseData.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseName}
                  </option>
                ))}
              </select>
              <h4 className="labelss">
                Certificate Id: <span className="required_asterisk">*</span>
              </h4>
              <input
                className="login-form-input"
                type="number"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
              />
              <h4 className="labelss">
                Certificate PDF: <span className="required_asterisk">*</span>
              </h4>
              <input className="select_option" type="file" onChange={(e) => setFile(e.target.files[0])} />

              {/* Display the selected course image */}
              {selectedCourseId && (
                <div>
                  <h4 className="labelss">
                    Selected Course Image: <span className="required_asterisk">*</span>
                  </h4>
                  <img
                    // style={{ display: 'none' }}
                    src={`https://cpdbackend.onrender.com/uploads/${
                      courseData.find((course) => course._id === selectedCourseId).filename
                    }`}
                    alt={courseData.find((course) => course._id === selectedCourseId).courseName}
                  />
                </div>
              )}

              <button className="add-course-btn" type="submit">
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCourses;
