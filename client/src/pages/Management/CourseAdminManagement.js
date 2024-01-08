import axios from 'axios';
import React, { useState } from 'react';

const CourseAdminManagement = () => {
  const [courseName, setCourseName] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('courseName', courseName);

    const baseUrl = 'https://cpdbackend.onrender.com/admin/addcourse';

    try {
      await axios.post(baseUrl, formData);
      alert('Course Successfully added');
      setCourseName('');
      setFile(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Add Course</h1>
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
          <input id="file" className="login-form-input" type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <button className="add-course-btn" type="submit">
          Add
        </button>
      </form>
    </div>
  );
};

export default CourseAdminManagement;
