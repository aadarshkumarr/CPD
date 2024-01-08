import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import axios from 'axios';

function ChangePassword() {
  const [previousPassword, setPreviousPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [alert, setAlert] = useState(null);

  const navigate = useNavigate();
  const userData = localStorage.getItem('user');
  const userDetails = JSON.parse(userData);
  const email = userDetails.email;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Handle change password logic here
      if (newPassword === confirmNewPassword) {
        const response = await axios.put(`https://cpdbackend.onrender.com/api/change-password`, {
          email,
          previousPassword,
          newPassword,
        });
        setAlert(<Alert severity="success">{response.data.message}</Alert>);
        clearAlertAfterDelay();
        setPreviousPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setTimeout(() => {
          navigate('/dashboard/profile');
        }, 3000);
      } else {
        setAlert(<Alert severity="error">New Password and Confirm Password do not match</Alert>);
        clearAlertAfterDelay();
      }
    } catch (err) {
      setAlert(<Alert severity="error">{err.response.data.error}</Alert>);
      clearAlertAfterDelay();
    }
  };

  const clearAlertAfterDelay = () => {
    setTimeout(() => {
      setAlert(null);
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '75vh',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Change Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', gap: '16px' }}>
            <TextField
              label="Previous Password"
              type="password"
              required
              value={previousPassword}
              onChange={(event) => setPreviousPassword(event.target.value)}
              sx={{ width: '100%' }}
            />
            <TextField
              label="New Password"
              type="password"
              required
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              sx={{ width: '100%' }}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              required
              value={confirmNewPassword}
              onChange={(event) => setConfirmNewPassword(event.target.value)}
              sx={{ width: '100%' }}
            />
            <Button style={{ backgroundColor: '#941414', color: 'white' }} type="submit">
              Change Password
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
}

export default ChangePassword;
