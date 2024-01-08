import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom';


const Card = ({course}) => {
    const user = localStorage.getItem('user');
  const userParse = JSON.parse(user);
  const registrationId = userParse._id;
  console.log(course.img);
  const navigate = useNavigate()

  const handleDownload = async (filepath) => {
    const [ path , filename ] = filepath.split("/");
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
  }

  const handleButtonClick = (url) => {
    if (url) {
      const newTab = window.open(url, '_blank');
      navigate(url, { target: newTab });
    }
  };

    return (
        <>
            <div key={course._id}>
                <div className="certificateSection" style={{ zIndex: 0 }}>
                    <div className="cardSection_certificate">
                        <div className="img_and_status">
                            <div className="img_cisa">
                                <img
                                    width={100}
                                    height={100}
                                    className="cer_img"
                                    src ={`https://cpdbackend.onrender.com/uploads/${course.img}`}
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
                            <button className="section2_btn"onClick={() => handleButtonClick(course.pdf1)}>
                                View/Accept Badges
                            </button>
                            <button className="section2_btn" onClick={() => handleDownload(course.pdf2)}>
                                Print Certificate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Card