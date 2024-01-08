import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-material-ui-carousel';
import axios from 'axios';
import JsPDF from 'jspdf';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './Cert_CPDmanage.css';
import { Link, useNavigate } from 'react-router-dom';

import AddCourses from './AddCourses/AddCourses';
import CourseSection from './CourseSection';
import CourseHistory from './CourseHistory/CourseHistory';

const CertCPDmanage = () => {
  const [CPD, setCPD] = useState([]);
  const [show, setShow] = useState(false);
  const [badgeData, setBadgeData] = useState(null);
  const user = localStorage.getItem('user');
  const userParse = JSON.parse(user);
  const registrationId = userParse._id;

  console.log(CPD);

  const navigate = useNavigate();

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
    async function fetchCPD() {
      try {
        const res = await axios.get(`https://cpdbackend.onrender.com/getcpd/${registrationId}`);
        // Filter the CPD data based on status === 'approved'
        const approvedCPD = res.data.data.filter((item) => item.status === 'approved');

        // Use reduce to group CPD data by course and accumulate hours
        const groupedCPD = approvedCPD.reduce((acc, cpd) => {
          const { course, hours } = cpd;
          if (acc[course]) {
            acc[course].hours += Number(hours);
          } else {
            acc[course] = { ...cpd, hours: Number(hours) }; // Create a new object with accumulated hours
          }
          return acc;
        }, {});

        // Convert the groupedCPD object back to an array of CPD data
        const combinedCPD = Object.values(groupedCPD);

        setCPD(combinedCPD);
      } catch (err) {
        console.log(err);
      }
    }
    fetchCPD();
  }, [registrationId]);

  const handleAddCPD = () => {
    navigate('/dashboard/addcpd');
  };

  const percentage = 0;
  const hours = 0;

  return (
    <>
      {!show && (
        <section className="section">
          <div className="main_container">
            <div className="cardSection">
              <div className="section1">
                <h2>Certification & CPD Management</h2>
                <p>
                  Enter Certification requires an annual renewal to remain activeand in good standing. Renewal includes:
                </p>
                <li>Earning and reporting a minimun of 20 cpd hours annuals.</li>
                <li>Earning and reporting a minimun of 60 cpd hours for your three year reporting cpd.</li>
                <li>Payment of the annual maintentance fee.</li>
                <div className="desc">
                  Learn about
                  <a href="https://www.careerandskills.com/pages/cpd" target="_blank" rel="noreferrer">
                    <span>CPD Policies</span>
                  </a>
                </div>
                <h5>
                  We recommends earning 40 cpd hourse to help meet the three-year cycle requirement. To learn more,
                  review the applicable cpd policy. All policies are found
                  <Link className="link_here" to="#">
                    here
                  </Link>
                </h5>
              </div>
            </div>
          </div>
          {CPD.length > 0 ? (
            CPD.filter((item) => item.status === 'approved').map((item, index) => {
              const hours = item.hours;
              const percentage = (hours / 20) * 100;

              return (
                <div className="main_container2" key={index}>
                  {/* <button className="addCourse_btn" onClick={handleAddCPD}>
                    Add CPD
                  </button> */}
                  <h1 style={{ textAlign: 'center', textDecoration: 'underline' }}>{item.title}</h1>

                  <div className="card_progress">
                    <div className="earned_hours_main">
                      <h2 style={{ marginBottom: '16px', textAlign: 'center', color: '#941414' }}> CPD PROGRESS</h2>
                      <CircularProgressbar value={percentage} text={`${percentage}%`} strokeWidth="13" />
                    </div>
                    <div className="earned_hours_main">
                      <h2>Earned Hours</h2>
                      <div className="earned_hours">
                        <div className="earned_hours_curr">
                          <h4>Current year Cycle</h4>
                          <table>
                            <tbody>
                              <tr>
                                <th>You Earned</th>
                                <th>Total</th>
                              </tr>
                              <tr>
                                <td>{hours} hr</td>
                                <td>20 hr</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="earned_hours_threeyear">
                          <h4>3 Year Cycle</h4>
                          <table>
                            <tbody>
                              <tr>
                                <th>You Earned</th>
                                <th>Total</th>
                              </tr>
                              <tr>
                                <td>{hours} hr</td>
                                <td>20 hr</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="progress_bar_btns">
                        <button className="section2_btn">PAY MAINTENANCE FEE</button>
                        <Link to="/dashboard/managecpd">
                          <button className="section2_btn">REPORT & MANAGE CPD </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="main_container2">
              <button className="addCourse_btn" onClick={handleAddCPD}>
                Add CPD
              </button>

              <h1 style={{ textAlign: 'center' }}>Add CPD →</h1>
              <div className="card_progress">
                <div className="earned_hours_main">
                  <h2 style={{ marginBottom: '16px', textAlign: 'center', color: '#941414' }}> CPD PROGRESS</h2>
                  <CircularProgressbar value={percentage} text={`${percentage}%`} strokeWidth="13" />
                </div>
                <div className="earned_hours_main">
                  <h2>Earned Hours</h2>
                  <div className="earned_hours">
                    <div className="earned_hours_curr">
                      <h4>Current year Cycle</h4>
                      <table>
                        <tbody>
                          <tr>
                            <th>You Earned</th>
                            <th>Total</th>
                          </tr>
                          <tr>
                            <td>{hours} hr</td>
                            <td>20 hr</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="earned_hours_threeyear">
                      <h4>3 Year Cycle</h4>
                      <table>
                        <tbody>
                          <tr>
                            <th>You Earned</th>
                            <th>Total</th>
                          </tr>
                          <tr>
                            <td>{hours} hr</td>
                            <td>60 hr</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="progress_bar_btns">
                    <button className="section2_btn">PAY MAINTENANCE FEE</button>
                    <Link to="/dashboard/managecpd">
                      <button className="section2_btn">REPORT & MANAGE CPD </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      <CourseSection />
      <CourseHistory />
    </>
  );
};

export default CertCPDmanage;
