import { Alert } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';

const CourseAdmin = () => {
  const [courseName, setCourseName] = useState('');
  const [file, setFile] = useState(null);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('courseName', courseName);

    const baseUrl = 'https://cpdbackend.onrender.com/admin/addcourse';

    try {
      await axios.post(baseUrl, formData);
      setAlert(<Alert severity="success">Course Successfully Uploaded</Alert>);
      clearAlertAfterDelay();
      setCourseName('');
      setFile(null);
    } catch (error) {
      console.log(error);
      setAlert(<Alert severity="error">{error.message}</Alert>);
      clearAlertAfterDelay();
    }
  };
  const clearAlertAfterDelay = () => {
    setTimeout(() => {
      setAlert(null);
      window.location.reload();
    }, 5000);
  };

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
        <div>
          <div className="brand-title">Add Course</div>
          <div>
            <form onSubmit={handleSubmit}>
              <div>
                <h4 htmlFor="courseName" className="labelss">
                  Course:
                </h4>
                <input
                  id="courseName"
                  className="login-form-input"
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
              </div>
              <div>
                <h4 htmlFor="file" className="labelss">
                  Add Image:
                </h4>
                <input id="file" className="select_option" type="file" onChange={(e) => setFile(e.target.files[0])} />
              </div>

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

export default CourseAdmin;
