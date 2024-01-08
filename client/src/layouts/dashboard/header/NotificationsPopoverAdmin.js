import { useEffect, useRef, useState } from 'react';
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
} from '@mui/material';
// utils
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

// ----------------------------------------------------------------------

export default function NotificationsPopoverAdmin() {
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
            px: 3,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2, px: 3 }}>
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
  const [notifications, setNotifications] = useState([]);
  const [notifications2, setNotifications2] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await axios.get(`https://cpdbackend.onrender.com/courses/pending`);
        const pendingCourses = res.data.map((course) => {
          return {
            notifyName: ` ${course.name}`,
            notifyCourse: ` ${course.course}`,
            courseTime: ` ${course.createdAt}`,
          };
        });
        setNotifications(pendingCourses);
      } catch (err) {
        console.log(err);
      }
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    if (notification.action === 'added') {
      const newNotification = {
        notifyName: ` ${notification.course.name}`,
        notifyCourse: ` ${notification.course.course}`,
        courseTime: ` ${notification.course.createdAt}`,
      };
      setNotifications([...notifications, newNotification]);
    }
  }, [notification]);

  // CPD Notifications
  useEffect(() => {
    async function fetchCPD() {
      try {
        const res = await axios.get(`https://cpdbackend.onrender.com/courses/pending`);
        const pendingCPD = res.data.map((addcpd) => {
          return {
            notifyTitle: ` ${addcpd.title}`,
            notifyCPD: ` ${addcpd.qualifyingActivity}`,
          };
        });
        setNotifications2(pendingCPD);
      } catch (err) {
        console.log(err);
      }
    }
    fetchCPD();
  }, []);

  useEffect(() => {
    if (notification.action === 'added') {
      const newNotification = {
        notifyTitle: ` ${notification.cpd.name}`,
        notifyCPD: ` ${notification.cpd.qualifyingActivity}`,
        courseTime: ` ${notification.course.createdAt}`,
      };
      setNotifications([...notifications2, newNotification]);
    }
  }, [notification]);

  return (
    <>
      {notifications.map((notification, index) => (
        <ListItemText
          key={index}
          primary={
            <Typography>
              A Course: {notification.notifyCourse} successfully added by - {notification.notifyName}
            </Typography>
          }
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
              {notification.courseTime}
            </Typography>
          }
        />
      ))}
      {notifications2.map((notification, index) => (
        <ListItemText
          key={index}
          primary={
            <Typography>
              A Course: {notifications2.notifyTitle} successfully added by - {notifications2.notifyCPD}
            </Typography>
          }
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
              {notification.courseTime}
            </Typography>
          }
        />
      ))}
    </>
  );
}
