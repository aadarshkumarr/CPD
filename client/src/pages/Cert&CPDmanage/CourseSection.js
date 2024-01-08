import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JsPDF from 'jspdf';
import logo from '../../assets/logo_icon.png';
import './Cert_CPDmanage.css';
import AddCourses from './AddCourses/AddCourses';

const CourseSection = () => {
  const [course, setCourse] = useState([]);
  const [show, setShow] = useState(false);
  const [badgeData, setBadgeData] = useState(null);

  const user = localStorage.getItem('user');
  const userParse = JSON.parse(user);
  const registrationId = userParse._id;
  const courseData = course;

  console.log(course, 'course');

  const pdfGenerate = () => {
    const doc = new JsPDF('landscape', 'px', 'a4', 'false');
    doc.addImage(logo, 'PNG', 65, 20, 500, 400);
    doc.save('a.pdf');
  };

  const handleDownload = async (filepath) => {
    const [path, filename] = filepath.split('/');
    try {
      const response = await axios.get(`https://cpdbackend.onrender.com/certi/download/${filename}`, {
        responseType: 'blob', // Important: Set the response type to 'blob'
      });

      // Create a temporary URL for the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element and simulate a click to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Clean up the temporary URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('An error occurred while downloading the file');
    }
  };
  useEffect(() => {
    async function fetchBadge() {
      try {
        const res = await axios.get(`https://cpdbackend.onrender.com/get-badge/${registrationId}`);
        console.log(res.data, 'badge');
        setBadgeData(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchBadge();
  }, [registrationId]);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await axios.get(`https://cpdbackend.onrender.com/courses/${registrationId}`);
        setCourse(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchCourse();
  }, [registrationId]);

  const handleAddCourse = () => {
    setShow(!show);
  };

  const handleBadgeLink = () => {
    if (badgeData) {
      window.open(badgeData.badgeLink, '_blank'); // Open the badge link in a new tab
    }
  };

  return (
    <>
      {!show && (
        <div>
          <button className="addCourse_btn" onClick={handleAddCourse}>
            {show ? 'Cancel' : 'Add Courses'}
          </button>
        </div>
      )}

      {!show && course.length === 0 ? (
        <div>
          <h3 style={{ textAlign: 'center' }}>Please Add a Course or CPD →</h3>
        </div>
      ) : !show ? (
        course.map((course) => (
          <div key={course._id}>
            <div className="certificateSection">
              <div className="cardSection_certificate">
                <div className="img_and_status">
                  <div className="img_cisa">
                    <img
                      width={100}
                      height={100}
                      className="cer_img"
                      src={`https://cpdbackend.onrender.com/uploads/${course.courseImg}`}
                      alt="cisa_img"
                    />
                  </div>
                  <div className="certified_sec">
                    <h3>{course.courseName}</h3>
                    <p>STATUS: ACTIVE</p>
                    <p>NUMBER: CISA- 0000{registrationId}</p>
                    <p>CERTIFICATE DATE: 1 DEC 2022</p>
                    <p>CERTIFIED THROUGH: 2025</p>
                    <p>3-YEAR-REPORTING-CYCLE: 2022-2025</p>
                  </div>
                </div>
                <div className="section2_btns">
                  <button className="section2_btn" onClick={handleBadgeLink}>
                    View/Accept Badges
                  </button>
                  <button className="section2_btn" onClick={() => handleDownload(course.pdf2)}>
                    Print Certificate
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <>
          <div>
            <button className="addCourse_btn" onClick={handleAddCourse}>
              {show ? 'Cancel' : 'Add Courses'}
            </button>
          </div>
          <AddCourses />
        </>
      )}
    </>
  );
};

export default CourseSection;
