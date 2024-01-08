import React, { useEffect, useState } from 'react';
import { MDBRow, MDBCol, MDBInput, MDBCheckbox, MDBBtn } from 'mdb-react-ui-kit';
import { CToast, CToastBody, CToastClose } from '@coreui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';

export default function EditProfile() {
  const [name, setName] = useState('');
  const [lastName, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [qualification, setQaulification] = useState('');
  const [show, setShow] = useState(false);
  const [file, setFile] = useState(null);
  const [alert, setAlert] = useState(null);

  //   console.log(user);
  console.log(dob);

  const navigate = useNavigate();

  const userData = localStorage.getItem('user');
  const userDetails = JSON.parse(userData);
  const userId = userDetails._id;

  useEffect(() => {
    async function fetchCPD() {
      try {
        const res = await axios.get(`https://cpdbackend.onrender.com/users/${userId}`);

        setName(res.data.name);
        setLastname(res.data.lastName);
        setEmail(res.data.email);
        setPhone(res.data.phone);
        setAddress(res.data.address);
        setQaulification(res.data.qualification);
        const date = new Date(res.data.dob);
        const formattedDate = date.toISOString().slice(0, 10);
        setDob(formattedDate);
      } catch (err) {
        console.log(err);
      }
    }
    fetchCPD();
  }, [userId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB <= 10) {
      formData.append('file', file);
    } else {
      alert('File size should be below 10MB');
      return;
    }
    formData.append('name', name);
    if (lastName !== '') {
      formData.append('lastName', name);
    }
    formData.append('email', email);
    if (dob !== '') {
      formData.append('dob', dob);
    }
    formData.append('phone', phone);
    if (qualification !== '') {
      formData.append('qualification', qualification);
    }
    if (address !== '') {
      formData.append('address', address);
    }

    const baseUrl = `https://cpdbackend.onrender.com/edit/${userId}`;

    try {
      const result = await axios.patch(baseUrl, formData);
      setAlert(<Alert severity="success">Profile updated Successfully</Alert>);
      clearAlertAfterDelay();
      setName('');
      setLastname('');
      setEmail('');
      setPhone('');
      setAddress('');
      setQaulification('');
      setDob('');
      setFile(null);
      setTimeout(() => {
        navigate('/dashboard/profile');
      }, 3000);
    } catch (error) {
      console.error(error);
      setAlert(<Alert severity="error">Failed to update profile</Alert>); // Set the error alert
      clearAlertAfterDelay();
    }
  };

  const clearAlertAfterDelay = () => {
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  useEffect(() => {
    let timeout;
    if (show) {
      timeout = setTimeout(() => {
        setShow(false);
        navigate('/dashboard/profile');
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [show]);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: '1000',
          width: '80%',
          maxWidth: '400px',
        }}
      >
        {alert}
      </div>

      <div style={{ marginTop: '7%', padding: '0 11%' }}>
        <form>
          <MDBRow className="mb-4">
            <MDBCol>
              <MDBInput
                id="form6Example1"
                label="First name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                id="form6Example2"
                label="Last name"
                value={lastName}
                onChange={(event) => setLastname(event.target.value)}
              />
            </MDBCol>
          </MDBRow>

          <MDBInput
            wrapperClass="mb-4"
            type="email"
            id="form6Example5"
            label="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            type="date"
            id="form6Example6"
            label="DOB"
            value={dob}
            onChange={(event) => setDob(event.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            type="tel"
            id="form6Example6"
            label="Phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            id="form6Example4"
            label="Address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            id="form6Example3"
            label="Qualification"
            value={qualification}
            onChange={(event) => setQaulification(event.target.value)}
          />

          <p className="form-label" htmlFor="customFile">
            Profile Picture
          </p>
          <input type="file" className="form-control" id="customFile" onChange={(e) => setFile(e.target.files[0])} />

          <MDBCheckbox
            wrapperClass="d-flex justify-content-center mb-4"
            id="form6Example8"
            label="Are you sure to Update"
            defaultChecked
          />

          <MDBBtn
            className="mb-4"
            style={{ backgroundColor: '#941414', color: 'white' }}
            type="submit"
            onClick={handleSubmit}
          >
            Update
          </MDBBtn>
        </form>
      </div>
    </>
  );
}
