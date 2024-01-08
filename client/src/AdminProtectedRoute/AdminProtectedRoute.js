import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Admin from '../pages/Admin/Admin';
import Header from '../layouts/dashboard/header';
import Nav from '../layouts/dashboard/nav';

const AdminProtectedRoute = (props) => {
  const [open, setOpen] = useState(false);

  const auth = localStorage.getItem('user');
  const user = JSON.parse(auth);
  const userRole = user.role;
  const userStatus = user.status;
  // console.log(userStatus)

  const APP_BAR_MOBILE = 64;
  const APP_BAR_DESKTOP = 92;

  const StyledRoot = styled('div')({
    display: 'flex',
    minHeight: '100%',
    overflow: 'hidden',
  });

  const Main = styled('div')(({ theme }) => ({
    flexGrow: 1,
    overflow: 'auto',
    minHeight: '100%',
    paddingTop: APP_BAR_MOBILE + 24,
    paddingBottom: theme.spacing(10),
    [theme.breakpoints.up('lg')]: {
      paddingTop: APP_BAR_DESKTOP + 24,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  }));

  if (props.roleRequired) {
    return auth ? (
      (props.roleRequired === userRole || props.roleRequired2 === userRole) && props.statusRequired === userStatus ? (
        <StyledRoot>
          <Header onOpenNav={() => setOpen(true)} />
          <Nav openNav={open} onCloseNav={() => setOpen(false)} />
          <Main>
            <Outlet />
          </Main>
        </StyledRoot>
      ) : (
        <Navigate to="/*" />
      )
    ) : (
      <Navigate to="/*" />
    );
  }
  return auth ? (
    <StyledRoot>
      <Header onOpenNav={() => setOpen(true)} />
      <Nav openNav={open} onCloseNav={() => setOpen(false)} />
      <Main>
        <Outlet />
      </Main>
    </StyledRoot>
  ) : (
    <Navigate to="/*" />
  );

  // if (props.roleRequired === userRole) {
  // 	return
  // }
};

export default AdminProtectedRoute;
