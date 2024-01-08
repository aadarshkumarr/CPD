import PropTypes from 'prop-types';
// @mui

import { Box, Stack, AppBar, Toolbar, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

// import { Box,  Divider, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// components
import Iconify from '../../../components/iconify';
//
// import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
// import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './NotificationsPopover1';
import NotificationsPopoverAdmin from './NotificationsPopoverAdmin';
// import NavBar from './Notification';
// import Notification from './Notification';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'none',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav }) {
  const userData = localStorage.getItem('user');
  const userDetails = JSON.parse(userData);
  const userRole = userDetails.role;

  return (
    <StyledRoot>
      <StyledToolbar>
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: 'text.primary',
            display: { lg: 'none' },
          }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          <AccountPopover />

          {/* Conditionally render NotificationsPopover or NotificationsPopoverAdmin based on userRole */}
          {userRole === 'user' && <NotificationsPopover />}
          {userRole === 'admin' || userRole === 'management' && <NotificationsPopoverAdmin />}
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
