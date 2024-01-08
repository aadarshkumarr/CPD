import axios from 'axios';
import React, { useState } from 'react';
import "./ForgotPassword.css"

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmitSignup = async (event) => {
    event.preventDefault();
    const data = { email };
    const baseUrl = 'https://cpdbackend.onrender.com/email-send';
    try {
      await axios.post(baseUrl, data);
      alert('Successfully sent OTP');

      //   setEmail('');
    } catch (error) {
      // console.error(error.response.data);
      alert(`${error.response.data.message}, Please try with another gmail`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmitSignup} className="form">
        <input
          className="signup_input"
          type="email"
          placeholder="Email"
          required
          onChange={(event) => setEmail(event.target.value)}
        />
        {/* <button
          type="submit"
          className="signup_btn"
          //   onClick={handleSignUpButtonClick}
        >
          Send Otp
        </button> */}
        <div className='password_container'>
          <input type="password" placeholder='Password' />
          <input type="password" placeholder='Confirm Password' />
          <button>Change Password</button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
