import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { sub } from 'date-fns';
import { faker } from '@faker-js/faker';

// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Tooltip,
  Divider,
  Popover,
  Typography,
  IconButton,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const NOTIFICATIONS = [
    {
      id: faker.datatype.uuid(),
      title: 'You have new message',
      avatar: null,
      type: 'chat_message',
      createdAt: sub(new Date(), { days: 1, hours: 3, minutes: 30 }),
      isUnRead: false,
    },
  ];
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    );
  };

  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Before that
              </ListSubheader>
            }
          >
            {notifications.slice(2, 5).map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    createdAt: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    isUnRead: PropTypes.bool,
    title: PropTypes.string,
    // description: PropTypes.instanceOf(Date),
    type: PropTypes.string,
    avatar: PropTypes.any,
  }),
};

function NotificationItem({ notification }) {
  const [user, setUser] = useState([]);

  const timestamp = user.createdAt;
  const date = new Date(timestamp); // example date fetched from MongoDB
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  console.log(day, month, year);
  console.log(date);

  const userData = localStorage.getItem('user');
  const userDetails = JSON.parse(userData);
  const userId = userDetails._id;

  useEffect(() => {
    async function fetchCPD() {
      try {
        const res = await axios.get(`https://cpdbackend.onrender.com/courses/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchCPD();
  }, [userId]);
  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>{/* <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar> */}</ListItemAvatar>
      <ListItemText
        primary={`Your course successfully add at ${date}`}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(notification.createdAt)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

// function renderContent(notification) {
//   const title = (
//     <Typography variant="subtitle2">
//       {notification.title}
//       <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
//         &nbsp; {noCase(notification.description)}
//       </Typography>
//     </Typography>
//   );

//   if (notification.type === 'order_placed') {
//     return {
//       avatar: <img alt={notification.title} src="/assets/icons/ic_notification_package.svg" />,
//       title,
//     };
//   }
//   if (notification.type === 'order_shipped') {
//     return {
//       avatar: <img alt={notification.title} src="/assets/icons/ic_notification_shipping.svg" />,
//       title,
//     };
//   }
//   if (notification.type === 'mail') {
//     return {
//       avatar: <img alt={notification.title} src="/assets/icons/ic_notification_mail.svg" />,
//       title,
//     };
//   }
//   if (notification.type === 'chat_message') {
//     return {
//       avatar: <img alt={notification.title} src="/assets/icons/ic_notification_chat.svg" />,
//       title,
//     };
//   }
//   return {
//     avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
//     title,
//   };
// }