import { Alert } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';

const CertUpload = () => {
  const [file, setFile] = useState(null);
  const [alert, setAlert] = useState(null);

  console.log(file);
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);

    const baseUrl = `https://cpdbackend.onrender.com/admin/upload`;

    try {
      await axios.post(baseUrl, formData);
      setAlert(<Alert severity="success">Certificate Successfully Uploaded</Alert>);
      clearAlertAfterDelay();

      setFile(null);
    } catch (error) {
      console.error(error);
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

      <div>
        <h1>Add Certificate</h1>
        <form onSubmit={handleSubmit}>
          <input className="login-form-input" type="file" onChange={(e) => setFile(e.target.files[0])} />
          {/* <h4 className="labelss">Course Id:</h4>
        <input
          className="login-form-input"
          type="number"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        /> */}

          <button className="login-form-btn" type="submit">
            Upload
          </button>
        </form>
      </div>
    </>
  );
};

export default CertUpload;
