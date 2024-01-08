import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './LoginSignupForm.css';
import zxcvbn from 'zxcvbn';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { countryData } from '../../data/CountryData';
import Loader from './Loading/Loader';
import logo from '../../assets/logo-removebg-preview (2).png';
import iicon from '../../assets/icons8-info.gif';

function LoginSignupForm() {
  const [countryCode, setCountryCode] = useState('');
  const [countryName, setCountryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPasswordSuggestions, setShowPasswordSuggestions] = useState(false); // State variable to track showing password suggestions

  const navigate = useNavigate();

  const handleShowPasswordSuggestions = () => {
    setShowPasswordSuggestions(true);
  };

  const handleClosePasswordSuggestions = () => {
    setShowPasswordSuggestions(false);
  };

  const handlePasswordInputChange = (event) => {
    setPassword(event.target.value);
  };

  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (auth) {
      navigate('/dashboard');
    }
  }, []);

  const handleSubmitSignup = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = { name, email, password, countryName, countryCode, phone };

    // Password strength validation using zxcvbn library
    const passwordResult = zxcvbn(data.password);
    if (passwordResult.score < 3) {
      alert('Please choose a stronger password.');
      setLoading(false);
      return;
    }

    const baseUrl = 'https://cpdbackend.onrender.com/signup';
    try {
      await axios.post(baseUrl, data);
      // alert('Successfully registered');
      navigate('/add-course');
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
    } catch (error) {
      // console.error(error.response.data);
      alert(`${error.response.data.message}, Please try with another gmail`);
    }
    setLoading(false);
  };

  const handleSubmitLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = { email, password };
    const baseUrl = 'https://cpdbackend.onrender.com/login';

    try {
      const result = await axios.post(baseUrl, data);
      console.log(result.data);
      if (result.data.name) {
        localStorage.setItem('user', JSON.stringify(result.data));

        if (result.data.status === 'blocked') {
          navigate('/block');
        } else {
          if (result.data.role === 'admin' || result.data.role === 'management') {
            navigate('/admin');
          }
          if (result.data.role === 'user') {
            navigate('/');
          }
        }
      } else {
        alert('Please type correct details');
      }
    } catch (error) {
      console.error(error);
      alert(`${error.response.data.message}`);
    }
    setLoading(false);
  };

  const handleSignUpButtonClick = () => {
    const container = document.getElementById('container');
    container.classList.add('right-panel-active');
  };

  const handleLogInButtonClick = () => {
    const container = document.getElementById('container');
    container.classList.remove('right-panel-active');
  };

  // Find the selected country object based on the selected code
  const selectedCountry = countryData.countryName.find((item) => item.country === countryName);
  useEffect(() => {
    const selectedCountry = countryData.countryName.find((item) => item.country === countryName);
    setCountryCode(selectedCountry?.code);
  }, [countryName]);

  return (
    <>
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>
      {!loading && (
        <div className="login">
          <div className="container login_signup_container" id="container">
            <div className="form-container sign-up-container">
              <form onSubmit={handleSubmitSignup} className="form">
                <h2 className="heading">Create Account</h2>

                <input
                  className="signup_input"
                  type="text"
                  placeholder="Name"
                  value={name}
                  required
                  onChange={(event) => setName(event.target.value)}
                />
                <input
                  className="signup_input"
                  type="email"
                  placeholder="Email"
                  required
                  onChange={(event) => setEmail(event.target.value)}
                />
                <div className="password-input-wrapper">
                  <input
                    className="signup_input"
                    type={showPasswordSuggestions ? 'text' : 'password'}
                    placeholder="Password"
                    required
                    onChange={handlePasswordInputChange}
                  />
                  <span
                    className="password-suggestion-icon"
                    onClick={handleShowPasswordSuggestions}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleShowPasswordSuggestions();
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <img style={{ marginLeft: '10px' }} width={30} height={30} src={iicon} alt="iicon" />
                  </span>
                </div>
                <select
                  className="select_input"
                  value={countryName}
                  onChange={(event) => setCountryName(event.target.value)}
                >
                  <option value="">Select Country</option>
                  {countryData.countryName.map((item, key) => (
                    <option key={key} value={item.country}>
                      {item.country}
                    </option>
                  ))}
                </select>

                <div className="code_phone_inputs">
                  <input
                    className="country_code_input"
                    type="text"
                    required
                    value={selectedCountry ? selectedCountry.code : 'Code'}
                  />

                  <input
                    className="phone_input"
                    type="number"
                    placeholder="Phone"
                    required
                    value={phone}
                    onChange={(event) => {
                      const inputPhone = event.target.value;
                      if (inputPhone.length <= 10) {
                        setPhone(inputPhone);
                      }
                    }}
                  />
                </div>

                <div className="terms-checkbox">
                  <input
                    type="checkbox"
                    id="termsCheckbox"
                    checked={isAgreed}
                    onChange={() => setIsAgreed(!isAgreed)}
                    required
                  />
                  <p className="terms_conditions" htmlFor="termsCheckbox">
                    You accept our Terms of Use and{' '}
                    <span style={{ color: 'blue', textDecoration: 'underline' }}>
                      <Link to="https://www.careerandskills.com/pages/cpd" target="blank">
                        Privacy Policy
                      </Link>
                    </span>
                  </p>
                </div>

                <button type="submit" className="signup_btn" onClick={handleSignUpButtonClick}>
                  Sign Up
                </button>
              </form>
            </div>
            <div className="form-container log-in-container ">
              <form onSubmit={handleSubmitLogin} className="form">
                <h1 className="heading">Log in</h1>

                {/* <span className="span">or use your account</span> */}
                <input
                  className="signup_input"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <input
                  className="signup_input"
                  type="password"
                  value={password}
                  placeholder="Password"
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <Link className="forgotPassword" to="/forgotpassword">
                  Forgot your password?
                </Link>
                <button type="submit" className="signup_btn" onClick={handleLogInButtonClick}>
                  Log In
                </button>
              </form>
            </div>
            <div className="overlay-container">
              <div className="overlay">
                <div className="overlay-panel overlay-left">
                  <h1 className="heading">Welcome Back!</h1>
                  <p className="p">Already have an account? Log In</p>
                  <button className="ghost signup_btn" onClick={handleLogInButtonClick}>
                    Log In
                  </button>
                </div>
                <div className="overlay-panel overlay-right">
                  <h1 className="heading">Hello, There!</h1>
                  <p className="p">Don't have an account? Sign Up Free</p>
                  <button className="ghost signup_btn" onClick={handleSignUpButtonClick}>
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {loading && <Loader />}

      {/* Password Suggestions */}
      <Dialog open={showPasswordSuggestions} onClose={handleClosePasswordSuggestions}>
        <DialogTitle>Password Suggestions</DialogTitle>
        <DialogContent>
          <DialogContentText>
            - Use at least 8 characters.
            <br />
            - Include a mix of uppercase and lowercase letters.
            <br />
            - Add numbers (e.g., 0-9) to increase complexity.
            <br />
            - Include special characters (e.g., @, $, !) for added security.
            <br />
            - Avoid using common words or phrases.
            <br />
            - Consider using a passphrase or random combination for better protection.
            <br />- Make sure it's unique and not used elsewhere.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordSuggestions} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default LoginSignupForm;
