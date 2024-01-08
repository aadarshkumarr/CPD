import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import './AddCPD.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CToast, CToastBody, CToastClose } from '@coreui/react';
import cisaLogo from '../../assets/cisa.png';
import ManageCPD from '../ManageCPD/ManageCPD';

const activityOptions = [
  'None',
  'CPD-01.01: CNS Trainings',
  'CPD-01.02: CNS Seminars',
  'CPD-01.03: CNS Events',
  'CPD-02.01: Non-CNS Professional Certifications',
  'CPD-03.01: Trainings',
  'CPD-03.02: Seminars',
  'CPD-03.03: Events',
  'CPD-04.01: Presentations',
  'CPD-04.02: Lecture',
  'CPD-04.03: Speaker',
  'CPD-05.01: Self-study',
  'CPD-05.02: Articles',
  'CPD-05.03: Authoring',
];
const deliveryOptions = ['None', 'Online', 'Offline', 'Hybrid', 'Other'];

const AddCPD = () => {
  const [title, setTitle] = useState('');
  const [sponsor, setSponsor] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [qualifyingActivity, setQualifyingActivity] = useState('');
  const [methodOfDelivery, setMethodOfDelivery] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [hours, setHours] = useState('');
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [course, setCourse] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [alert, setAlert] = useState(null);

  // console.log(course, 'course');
  const navigate = useNavigate();

  const user = localStorage.getItem('user');
  const userParse = JSON.parse(user);
  const userId = userParse._id;
  const username = userParse.name;
  const email = userParse.email;

  const checkFormValidity = () => {
    if (qualifyingActivity && methodOfDelivery && hours) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const hoursInputRef = useRef(null);
  const cpdSelectRef = useRef(null);

  useEffect(() => {
    const hoursInput = hoursInputRef.current;
    const cpdSelect = cpdSelectRef.current;

    const handleCpdSelectChange = () => {
      const selectedActivity = cpdSelect.value;
      switch (selectedActivity) {
        case 'CPD-01: CNS Trainings, Certifications, Seminars and Events':
          hoursInput.setAttribute('max', 20);
          break;
        case 'CPD-02: Non-CNS Professional Certifications':
          hoursInput.setAttribute('max', 10);
          break;
        case 'CPD-03: Trainings, Seminars, and Events':
          hoursInput.setAttribute('max', 5);
          break;
        case 'CPD-04: Presentations, Lecture and Speaker':
          hoursInput.setAttribute('max', 3);
          break;
        case 'CPD-05: Self-study, Articles, and Book Authoring':
          hoursInput.setAttribute('max', 1);
          break;
        default:
          hoursInput.removeAttribute('max');
      }
    };

    cpdSelect.addEventListener('change', handleCpdSelectChange);

    return () => {
      cpdSelect.removeEventListener('change', handleCpdSelectChange);
    };
  }, []);
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleSponsorChange = (event) => {
    setSponsor(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleActivityChange = (event) => {
    setQualifyingActivity(event.target.value);
  };

  const handleDeliveryChange = (event) => {
    const value = event.target.value;
    if (value === 'Other') {
      handleClickOpen();
    } else {
      setMethodOfDelivery(event.target.value);
    }
  };

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleConfirm = () => {
    setMethodOfDelivery(inputValue);
    handleClose();
  };

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await axios.get(`https://cpdbackend.onrender.com/courses/${userId}`);
        setCourse(['', ...res.data.map((course) => course.courseName)]);
      } catch (err) {
        console.log(err);
      }
    }
    fetchCourse();
  }, [userId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      userId,
      username,
      email,
      title,
      sponsor,
      startDate,
      endDate,
      qualifyingActivity,
      methodOfDelivery,
      hours,
      course: selectedCourse,
    };
    const baseUrl = `https://cpdbackend.onrender.com/addcpd/${userId}`;
    try {
      const response = await axios.post(baseUrl, data);
      console.log(response);
      setAlert(<Alert severity="success">CPD added Successfully</Alert>);
      setTitle('');
      setSponsor('');
      setStartDate('');
      setEndDate('');
      setQualifyingActivity('');
      setMethodOfDelivery('');
      setSelectedCourse('');
      setTimeout(() => {
        navigate('/dashboard/managecpd');
      }, 3000);
    } catch (error) {
      console.log(error);
      setAlert(<Alert severity="error">{error.message}</Alert>);
    }
  };

  const handleAddMore = () => {
    window.location.reload();
    navigate('/dashboard/addcpd');
  };

  const handleHoursChange = (event) => {
    const inputHours = event.target.value;

    // Check if the input is a valid positive integer
    if (/^\d+$/.test(inputHours) && inputHours >= 1) {
      setHours(inputHours);
    } else {
      setHours('');
    }
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
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Enter Value</DialogTitle>
          <DialogContent>
            <TextField
              label="Value"
              value={inputValue}
              onChange={handleInputChange}
              fullWidth
              sx={{ width: '500px' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleConfirm} variant="contained" color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      {!show && (
        <div className="main_container">
          <div className="container_addCPD">
            <div className="brand-title">ADD CPD</div>
            <p>CPD Details</p>
            <div className="inputss">
              <p className="required_p">*All fields Required</p>
              <form onSubmit={handleSubmit}>
                <h4 className="labelss">
                  Title <span className="required_asterisk">*</span>
                </h4>
                <input
                  className="login-form-input"
                  required
                  type="text"
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                />
                <h4 className="labelss">
                  Course <span className="required_asterisk">*</span>
                </h4>
                <select
                  required
                  className="login-form-input"
                  id="courseSelect"
                  ref={cpdSelectRef}
                  onBlur={checkFormValidity}
                  value={selectedCourse}
                  onChange={handleCourseChange}
                >
                  {course.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <h4 className="labelss">
                  Sponsor Organization <span className="required_asterisk">*</span>
                </h4>
                <input
                  required
                  className="login-form-input"
                  type="text"
                  id="sponsor"
                  value={sponsor}
                  onChange={handleSponsorChange}
                />

                <div className="date_container">
                  <div className="date_child">
                    <h4 className="labelss">
                      Start Date: <span className="required_asterisk">*</span>
                    </h4>
                    <input
                      required
                      className="login-form-input"
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={handleStartDateChange}
                    />
                  </div>
                  <div className="date_child">
                    <h4 className="labelss">
                      End Date: <span className="required_asterisk">*</span>
                    </h4>
                    <input
                      required
                      className="login-form-input"
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={handleEndDateChange}
                      min={startDate || ''}
                      disabled={!startDate}
                    />
                  </div>
                </div>

                <h4 className="labelss">
                  Qualifying Activity: <span className="required_asterisk">*</span>
                </h4>
                <select
                  required
                  className="login-form-input"
                  id="qualifyingActivity"
                  ref={cpdSelectRef}
                  onBlur={checkFormValidity}
                  value={qualifyingActivity}
                  onChange={handleActivityChange}
                >
                  {activityOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <h4 className="labelss">
                  Method of Delivery: <span className="required_asterisk">*</span>
                </h4>
                <select
                  required
                  className="login-form-input"
                  id="methodOfDelivery"
                  value={methodOfDelivery}
                  onChange={handleDeliveryChange}
                >
                  {deliveryOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <h4 className="labelss">
                  Hours: <span className="required_asterisk">*</span>
                </h4>
                <input
                  required
                  className="login-form-input"
                  type="text"
                  id="title"
                  value={hours}
                  onChange={handleHoursChange}
                  // maxLength="2"
                />

                <div className="addCPD_about">
                  <h3>Certification Receiving Hours</h3>
                  <p>
                    Enter the number of qualifying ADD CPD hours for the certification of your choosing from the list
                    below
                  </p>
                  <div className="img_and_hour">
                    <img src={cisaLogo} alt="cisa_logo" />
                    <p>
                      Reminder: Your annual minimum requirement is 20 ADD CPD hours. A total of 60 ADD CPD hours are
                      required for your 3-year cycle. Please refer to the ADD CPD Policy for full requirements.
                    </p>

                    {/* <div className="hours">
                      Hours
                      <input
                        type="text"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        onBlur={checkFormValidity}
                        ref={hoursInputRef}
                      />
                    </div> */}
                  </div>
                </div>

                <div className="addCPD_btn">
                  <button className="add-cpd-btn" type="submit">
                    Save & Close
                  </button>
                  <button className="add-cpd-btn" type="button" onClick={handleAddMore}>
                    Add More
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {show && <ManageCPD />}
    </>
  );
};

export default AddCPD;

// console.log(error.response.data.message);
// setAlert(<Alert severity="error">{error.response.data.message}</Alert>);
