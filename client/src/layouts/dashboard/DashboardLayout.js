import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//
// import DashboardAppPage from '../../pages/DashboardAppPage';
import Header from './header';
import Nav from './nav';

// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------

export default function DashboardLayout(props) {
  const [open, setOpen] = useState(false);
  const auth = localStorage.getItem('user');
  const user = JSON.parse(auth);
  const userStatus = user?.status || 'approved';
  const statusRequiredArray = Array.isArray(props.statusRequired) ? props.statusRequired : [props.statusRequired];

  // Check if the user status is included in the allowed status array
  const isStatusAllowed = statusRequiredArray.includes(userStatus);

  return auth && isStatusAllowed ? (
    <StyledRoot>
      <Header onOpenNav={() => setOpen(true)} />
      <Nav openNav={open} onCloseNav={() => setOpen(false)} />
      <Main>
        <Outlet />
      </Main>
    </StyledRoot>
  ) : (
    <Navigate to="/login" />
  );
}
