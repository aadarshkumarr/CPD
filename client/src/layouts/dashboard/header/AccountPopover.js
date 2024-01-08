import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// @mui
import { alpha } from '@mui/material/styles';

import { Box, Divider, Typography, Stack, MenuItem, IconButton, Popover } from '@mui/material';
// mocks_
import profilePic from '../../../assets/Profilepic.png';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  const userData = localStorage.getItem('user');
  const userDetails = JSON.parse(userData);
  const userName = userDetails.name;
  const userEmail = userDetails.email;
  const userRole = userDetails.role;
  const userId = userDetails._id;

  // console.log(userRole);

  function MENU_OPTIONS() {
    if (userRole === 'user') {
      return [
        {
          label: 'Home',
          icon: 'eva:home-fill',
          path: '/dashboard/app',
        },
        {
          label: 'Profile',
          icon: 'eva:person-fill',
          path: '/dashboard/profile',
        },
      ];
    }
    return [
      {
        label: 'Home',
        icon: 'eva:home-fill',
        path: '/admin',
      },
    ];
  }

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

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleLogOut = () => {
    localStorage.clear();
    navigate('/login');
  };
  const handleClose = () => {
    setOpen(null);
  };

  const handleMenuItemClick = (option) => {
    handleClose();
    navigate(option.path);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '8px',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <img width={50} height={50} src={`https://cpdbackend.onrender.com/uploads/${user.img}`} alt="profilePic" />
        <Box>
          <Typography variant="subtitle2" sx={{ color: 'text.primary', ml: 1 }}>
            {userName}
          </Typography>
        </Box>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {userName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userEmail}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS().map((option) => (
            <MenuItem key={option.label} onClick={() => handleMenuItemClick(option)}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogOut} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
