import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MDBCol, MDBRow, MDBBreadcrumb, MDBBreadcrumbItem } from 'mdb-react-ui-kit';
import Profile from './Profile';
import EditProfile from './EditProfile';

const ProfileMain = () => {
  const [activeComponent, setActiveComponent] = useState('profile');

  const handleShowProfile = () => {
    setActiveComponent('profile');
  };

  const handleShowEditProfile = () => {
    setActiveComponent('editProfile');
  };

  return (
    <div>
      <MDBRow>
        <MDBCol>
          <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
            <MDBBreadcrumbItem onClick={handleShowProfile} active={activeComponent === 'profile'}>
              <Link> Profile</Link>
            </MDBBreadcrumbItem>

            <MDBBreadcrumbItem onClick={handleShowEditProfile} active={activeComponent === 'editProfile'}>
              <Link>Edit Profile</Link>
            </MDBBreadcrumbItem>
          </MDBBreadcrumb>
        </MDBCol>
      </MDBRow>

      {activeComponent === 'profile' && <Profile />}
      {activeComponent === 'editProfile' && <EditProfile />}
    </div>
  );
};

export default ProfileMain;
