import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage } from 'mdb-react-ui-kit';
import axios from 'axios';
import profilePic from '../../assets/Profilepic.png';
import EditProfile from './EditProfile';
import './Profile.css';
import editIcon from '../../assets/edit.png';
import profilePicIcon from '../../assets/profile.png';

export default function Profile() {
  const [user, setUser] = useState([]);
  const [show, setShow] = useState(false);
  const [idEye, setIdEye] = useState(false);
  const [nameEye, setNameEye] = useState(false);
  const [emailEye, setEmailEye] = useState(false);
  const [phoneEye, setPhoneEye] = useState(false);
  const [password, setPassword] = useState(''); // Password input
  const [passwordIsValid, setPasswordIsValid] = useState(true); // Default to true
  const [currentSection, setCurrentSection] = useState(null); // Track the current section
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [alert, setAlert] = useState(null);
  const [changePasswordClicked, setChangePasswordClicked] = useState(false);

  const navigate = useNavigate();

  const userData = localStorage.getItem('user');
  const userDetails = JSON.parse(userData);
  const userId = userDetails._id;

  useEffect(() => {
    async function fetchCPD() {
      try {
        const res = await axios.get(`https://cpdbackend.onrender.com/users/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchCPD();
  }, [userId]);

  const handleProfile = () => {
    // Set the section to 'edit' and open the password modal
    const section = 'edit';
    setCurrentSection(section);
    openPasswordModal();
  };
  const handleChangePassword = () => {
    // Set the section to 'password' and open the password modal
    const section = 'password';
    setCurrentSection(section);
    openPasswordModal();
  };

  const validatePassword = async (section) => {
    try {
      const response = await axios.post('https://cpdbackend.onrender.com/check-password', {
        userId: userDetails._id,
        password,
      });

      if (response.data.isValid) {
        setPasswordIsValid(true);
        setCurrentSection(null); // Reset the current section
        setIdEye(true);
        setNameEye(true);
        setEmailEye(true);
        setPhoneEye(true);
        if (section === 'password') {
          navigate('/dashboard/change_password'); // Replace with your actual route
        }
        if (section === 'edit') {
          navigate('/dashboard/edit-profile'); // Replace with your actual route
        }

        closePasswordModal();
        setAlert(null);
        // Clear the error alert when password is valid
      } else {
        setPasswordIsValid(false);
        setAlert(<Alert severity="error">Password is incorrect</Alert>); // Show error alert for wrong password
      }
    } catch (error) {
      console.error(error);
      setAlert(<Alert severity="error">An error occurred</Alert>); // Show error alert for other errors
    }
  };

  const openPasswordModal = () => {
    setPassword('');
    setPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setPassword('');
    setPasswordModalOpen(false);
    setCurrentSection(null); // Clear the current section
    setAlert(null); // Clear the error alert when password modal is closed
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
        <button className="edit_btn" onClick={handleProfile}>
          {show ? (
            <img width={30} height={30} src={profilePicIcon} alt="editIcon" />
          ) : (
            <img width={30} height={30} src={editIcon} alt="editIcon" />
          )}
        </button>
      </div>

      {!show && (
        <section style={{ marginTop: '4%' }}>
          <MDBContainer className="py-5">
            <MDBRow>
              <MDBCol lg="4">
                <MDBCard className="mb-4">
                  <MDBCardBody className="text-center d-flex">
                    <img
                      width={100}
                      height={100}
                      src={`https://cpdbackend.onrender.com/uploads/${user.img}`}
                      alt="profilePic"
                    />
                    <h4 className="text-muted text-center m-4">
                      {user.name} &nbsp; {user.lastName}
                    </h4>
                  </MDBCardBody>
                </MDBCard>
                <Button style={{ backgroundColor: '#941414', color: 'white' }} onClick={handleChangePassword}>
                  Change Password
                </Button>
              </MDBCol>
              <MDBCol lg="8">
                <MDBCard className="mb-4">
                  <MDBCardBody>
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText>ID</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <div style={{ width: '75%', position: 'relative' }}>
                          <MDBCardText
                            className="text-muted"
                            style={{
                              border: '0.5px solid gray',
                              width: '100%',
                              padding: '5px',
                              marginBottom: '15px',
                              borderRadius: '5px',
                            }}
                          >
                            {idEye ? user.userId : 'xxx'}
                          </MDBCardText>
                          <VisibilityIcon
                            onClick={openPasswordModal} // Open the password modal on every click
                            style={{ position: 'absolute', top: '15%', right: '3%', color: 'gray' }}
                            fontSize="medium"
                          />
                        </div>
                      </MDBCol>
                    </MDBRow>

                    <hr />
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText>Full Name</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <div style={{ width: '75%', position: 'relative' }}>
                          <MDBCardText
                            className="text-muted"
                            style={{
                              border: '0.5px solid gray',
                              width: '100%',
                              padding: '5px',
                              marginBottom: '15px',
                              borderRadius: '5px',
                            }}
                          >
                            {nameEye ? user.name : 'xxxxxx'}
                          </MDBCardText>
                          <VisibilityIcon
                            onClick={openPasswordModal} // Open the password modal on every click
                            style={{ position: 'absolute', top: '15%', right: '3%', color: 'gray' }}
                            fontSize="medium"
                          />
                        </div>
                      </MDBCol>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText>Email</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <div style={{ width: '75%', position: 'relative' }}>
                          <MDBCardText
                            className="text-muted"
                            style={{
                              border: '0.5px solid gray',
                              width: '100%',
                              padding: '5px',
                              marginBottom: '15px',
                              borderRadius: '5px',
                            }}
                          >
                            {emailEye ? user.email : 'xxxxxx'}
                          </MDBCardText>
                          <VisibilityIcon
                            onClick={openPasswordModal} // Open the password modal on every click
                            style={{ position: 'absolute', top: '15%', right: '3%', color: 'gray' }}
                            fontSize="medium"
                          />
                        </div>
                      </MDBCol>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText>Phone</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <div style={{ width: '75%', position: 'relative' }}>
                          <MDBCardText
                            className="text-muted"
                            style={{
                              border: '0.5px solid gray',
                              width: '100%',
                              padding: '5px',
                              marginBottom: '15px',
                              borderRadius: '5px',
                            }}
                          >
                            {phoneEye ? user.phone : 'xxxxxx'}
                          </MDBCardText>
                          <VisibilityIcon
                            onClick={openPasswordModal} // Open the password modal on every click
                            style={{ position: 'absolute', top: '15%', right: '3%', color: 'gray' }}
                            fontSize="medium"
                          />
                        </div>
                      </MDBCol>
                    </MDBRow>

                    <hr />
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </section>
      )}
      {show && passwordIsValid && <EditProfile />}

      {(nameEye || emailEye || phoneEye) && !passwordIsValid && currentSection && (
        <div>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={() => validatePassword(currentSection)}>Confirm</button>
        </div>
      )}
      {passwordModalOpen && (
        <div className="password-modal">
          <div className="password-modal-content">
            <h2>Enter Your Password</h2>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              style={{ backgroundColor: '#941414', color: 'white' }}
              onClick={() => validatePassword(currentSection)}
            >
              Confirm
            </button>
            <button style={{ backgroundColor: '#941414', color: 'white' }} onClick={closePasswordModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
