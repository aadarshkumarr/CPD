import { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get('https://cpdbackend.onrender.com/pending')
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          <p>ID: {user.id}</p>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <p>Status: {user.status}</p>
        </div>
      ))}
    </div>
  );
};

export default Users;
