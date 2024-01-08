import { useState, useEffect } from 'react'; // Import useState and useEffect from React
import axios from 'axios'; // Import axios for making HTTP requests
import { sample } from 'lodash';

// ----------------------------------------------------------------------

// Create an initial state for users
const initialState = [];

const Users = () => {
  // Define state for users and setUsers function to update the state
  const [users, setUsers] = useState(initialState);
  console.log(users);
  console.log(Array.isArray(users));

  // Fetch data using useEffect hook
  useEffect(() => {
    axios
      .get('https://cpdbackend.onrender.com/pending')
      .then((res) => {
        // Update the users state with the fetched data
        setUsers(
          res.data.map((user) => ({
            id: user.userId,
            name: user.name,
            email: user.email,
            phone: user.phone,
            status: user.status,
            role: user.role,
          }))
        );
      })
      .catch((err) => console.log(err));
  }, []);

  // Render your component JSX with the fetched data from users state
  return (
    // Render your component JSX with the fetched data from users state
    <div>
      {users.map((user) => (
        // Render each user data in your component JSX
        <div key={user.userId}>
          <p>ID: {user.userId}</p>

          <p>Name: {user.name}</p>
          <p>email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <p>Status: {user.status}</p>
        </div>
      ))}
    </div>
  );
};

export default Users;
