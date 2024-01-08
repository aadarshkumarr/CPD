import axios from 'axios';
import React, { useState } from 'react';

const CertUploadManagement = () => {
  const [file, setFile] = useState(null);
  console.log(file);
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);

    const baseUrl = `https://cpdbackend.onrender.com/admin/upload`;

    try {
      await axios.post(baseUrl, formData);
      alert('Certificate Successfully Uploaded');
      setFile(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
  );
};

export default CertUploadManagement;
