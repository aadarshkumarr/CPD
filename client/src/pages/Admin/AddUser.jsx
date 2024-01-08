import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, FormControl, Box, MenuItem, Alert } from '@mui/material';
import { countryData } from '../../data/CountryData';

const roles = ['management', 'user'];

function RegistrationForm() {
  const [countryName, setCountryName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [alert, setAlert] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = { name, email, password, countryName, countryCode, phone, role };

    const baseUrl = 'https://cpdbackend.onrender.com/signup';
    try {
      await axios.post(baseUrl, data);
      setAlert(<Alert severity="success">Successfully registered</Alert>);
      clearAlertAfterDelay();
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
    } catch (error) {
      setAlert(<Alert severity="error">{error.response.data.message}</Alert>);
      clearAlertAfterDelay();
    }
  };

  const handleCountryChange = (selectedCountry) => {
    setCountryName(selectedCountry);

    // Find the corresponding country code for the selected country
    const selectedCountryData = countryData.countryName.find((item) => item.country === selectedCountry);
    if (selectedCountryData) {
      setCountryCode(selectedCountryData.code);
    } else {
      setCountryCode(''); // Set the country code to empty if no matching country is found
    }
  };

  const clearAlertAfterDelay = () => {
    setTimeout(() => {
      setAlert(null);
      window.location.reload();
    }, 5000);
  };

  const handlePhoneChange = (event) => {
    const input = event.target.value;
    const sanitizedInput = input.replace(/\D/g, ''); // Remove non-digit characters

    if (sanitizedInput.length <= 10) {
      setPhoneNumber(sanitizedInput);
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

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '500px', gap: '16px' }}>
          <TextField
            label="Name"
            name="name"
            required
            sx={{ width: '100%' }}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            required
            sx={{ width: '100%' }}
            onChange={(event) => setEmail(event.target.value)}
          />
          <FormControl sx={{ width: '100%' }}>
            <TextField
              select
              label="Role"
              name="role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              required
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <TextField
              select
              label="Country"
              name="country"
              required
              value={countryName}
              onChange={(event) => handleCountryChange(event.target.value)}
            >
              <MenuItem value="">Select Country</MenuItem>
              {countryData.countryName.map((item) => (
                <MenuItem key={item.countryCode} value={item.country}>
                  {item.country}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>

          <TextField
            label="Country Code"
            name="countryCode"
            value={countryCode}
            placeholder={countryCode ? '' : 'Enter Country Code'} // Conditionally set the placeholder
            disabled
            sx={{ width: '100%' }}
          />
          <TextField
            label="Phone"
            name="phone"
            required
            sx={{ width: '100%' }}
            value={phoneNumber}
            onChange={handlePhoneChange}
            inputProps={{
              maxLength: 10,
            }}
          />
          <TextField label="Password" name="password" type="password" required sx={{ width: '100%' }} />
          <Button style={{ backgroundColor: '#941414', color: 'white', width: '100px', margin: 'auto' }} type="submit">
            Submit
          </Button>
        </Box>
      </form>
    </>
  );
}

export default RegistrationForm;
