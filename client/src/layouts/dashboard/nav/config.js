import { useEffect, useState } from 'react';
import SvgColor from '../../../components/svg-color';

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

function GetNavConfig() {
  const baseConfig = [
    {
      title: 'dashboard',
      path: '/dashboard/app',
      icon: icon('ic_cart'),
    },
    {
      title: 'CPD Management',
      path: '/dashboard/cpdmanagement',
      icon: icon('ic_management'),
    },
    {
      title: 'Manage CPD',
      path: '/dashboard/managecpd',
      icon: icon('ic_disabled'),
    },
    {
      title: 'Add CPD',
      path: '/dashboard/addcpd',
      icon: icon('ic_add_cpd'),
    },
    {
      title: 'Add Course',
      path: '/dashboard/addcourse',
      icon: icon('ic_lock'),
    },
    {
      title: 'profile',
      path: '/dashboard/profile',
      icon: icon('ic_analytics'),
    },
    // {
    //   title: 'Print Certificate',
    //   path: '/dashboard/print',
    //   icon: icon('ic_cpd'),
    // },
  ];

  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    const userParse = JSON.parse(user);
    const role = userParse?.role || '';
    setUserRole(role);
  }, []);

  if (userRole === 'admin') {
    return [
      {
        title: 'Admin',
        path: '/admin',
        icon: icon('ic_admin'),
      },
      {
        title: 'All Users',
        path: '/admin/all-user',
        icon: icon('ic_all_user'),
      },
      {
        title: 'Expire Users',
        path: '/admin/expire-user',
        icon: icon('ic_expire'),
      },
      {
        title: 'Pending Users',
        path: '/admin/approve',
        icon: icon('ic_pending_user'),
      },
      {
        title: 'All Approved Users',
        path: '/admin/approve-all',
        icon: icon('ic_approve'),
      },
      {
        title: 'Pending Course',
        path: '/admin/course',
        icon: icon('ic_pending_course'),
      },
      {
        title: 'Pending CPD',
        path: '/admin/cpd',
        icon: icon('ic_pending_cpd'),
      },
      {
        title: 'Freeze User',
        path: '/admin/freeze',
        icon: icon('ic_block'),
      },
      {
        title: 'Add Course',
        path: '/admin/addcourse',
        icon: icon('ic_lock'),
      },
      {
        title: 'Freeze Courses',
        path: '/admin/freeze/courses',
        icon: icon('ic_freeze_course'),
      },
      {
        title: 'Add Users',
        path: '/admin/add-user',
        icon: icon('ic_add_user'),
      },
    ];
  }

  if (userRole === 'management') {
    return [
      {
        title: 'Management',
        path: '/admin',
        icon: icon('ic_admin'),
      },
      {
        title: 'All Users',
        path: '/admin/all-user',
        icon: icon('ic_all_user'),
      },
      {
        title: 'Expire Users',
        path: '/admin/expire-user',
        icon: icon('ic_expire'),
      },
      {
        title: 'Pending Users',
        path: '/admin/approve',
        icon: icon('ic_pending_user'),
      },
      {
        title: 'All Approved Users',
        path: '/admin/approve-all',
        icon: icon('ic_approve'),
      },
      {
        title: 'Pending Course',
        path: '/admin/course',
        icon: icon('ic_pending_course'),
      },
      {
        title: 'Pending CPD',
        path: '/admin/cpd',
        icon: icon('ic_pending_cpd'),
      },
      {
        title: 'Freeze User',
        path: '/admin/freeze',
        icon: icon('ic_block'),
      },
      {
        title: 'Add Course',
        path: '/admin/addcourse',
        icon: icon('ic_lock'),
      },
      {
        title: 'Freeze Courses',
        path: '/admin/freeze/courses',
        icon: icon('ic_freeze_course'),
      },
    ];
  }

  return baseConfig;
}

export default GetNavConfig;
