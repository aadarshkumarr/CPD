import React, { useEffect, useState } from 'react';
import './print.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CToast, CToastBody, CToastClose } from '@coreui/react';

const Print = () => {
  const [filename, setfileName] = useState('');
  //   const [certiId, setCertiID] = useState("");
  const [certData, setCertData] = useState([]);
  const [show, setShow] = useState(false);
  const [fileData, setFileData] = useState(null);
  console.log(filename);
  const user = localStorage.getItem('user');
  const userParse = JSON.parse(user);
  const registrationId = userParse._id;

  const navigate = useNavigate();

  //   console.log('course DatA =====> ', courseData.name);

  useEffect(() => {
    async function fetchCPD() {
      try {
        const res = await axios.get(`https://cpdbackend.onrender.com/user/certificates`);
        setCertData(res.data);
      } catch (err) {
        console.log(err.message);
      }
    }
    fetchCPD();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const baseUrl = `https://cpdbackend.onrender.com/download/${filename}`;

    try {
      // Make a request to the backend API endpoint
      const response = await axios.get(baseUrl, {
        responseType: 'blob', // Set the response type to 'blob' to receive binary data
      });
      console.log(response);
      // Extract the file name and extension from the response headers
      const contentDisposition = response.headers['content-disposition'];
      console.log(contentDisposition);
      const fileName = contentDisposition
        .split(';')
        .find((part) => part.trim().startsWith('filename='))
        .split('=')[1]
        .replace(/"/g, '');

      // Create a URL object from the binary data
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link element to initiate the file download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
    // try {
    //   await axios.get(baseUrl);
    //   setShow(true);
    //   setfileName('');
    // } catch (error) {
    //   console.error(error);
    // }
  };

  useEffect(() => {
    let timeout;
    if (show) {
      timeout = setTimeout(() => {
        setShow(false);
        navigate('/');
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [show]);

  const handleActivityChange = (event) => {
    setfileName(event.target.value);
  };

  return (
    <>
      {show && (
        <CToast visible color="success" className="text-white align-items-center">
          <div className="d-flex">
            <CToastBody className="ml-4">Course Successfully Added</CToastBody>
            <CToastClose className="me-2 m-auto" white />
          </div>
        </CToast>
      )}
      <div className="main_container">
        <div className="">
          <div className="brand-title">Print Certificate</div>

          <div className="inputss">
            <form onSubmit={handleSubmit}>
              <h4 className="labelss">Select:</h4>
              <select
                className="login-form-input"
                id="qualifyingActivity"
                value={filename}
                onChange={handleActivityChange}
              >
                {certData.map((certi) => (
                  <option key={certi._id} value={certi._id}>
                    {certi.filename}
                  </option>
                ))}
              </select>
              {/* <h4 className="labelss">Course Id:</h4>
              <input
                className="login-form-input"
                type="number"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              /> */}

              <button className="add-course-btn" type="submit">
                Download
              </button>
              {fileData && (
                <div>
                  <a href={fileData} download={`file.${fileData.split('.').pop()}`}>
                    Downloaded File
                  </a>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Print;
