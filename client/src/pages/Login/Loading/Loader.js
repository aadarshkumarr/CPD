import React from 'react';
import ReactLoading from 'react-loading';
import './Loading.css';

const Loader = ({ type, color }) => (
  <ReactLoading type={type} className="loader" color={'#941414'} height={'74vh'} width={100} />
);

export default Loader;
// Lodaer
