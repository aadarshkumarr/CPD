import { Link } from 'react-router-dom';

import { Helmet } from 'react-helmet-async';
import './Dashboard.css';

import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';

import { AppWidgetSummary } from '../sections/@dashboard/app';
import medal from '../assets/gold-medal.png';
import cisaLogo from '../assets/cisa.png';
// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Link to="/dashboard/profile">
              <AppWidgetSummary title="Profile" icon={'icomoon-free:profile'} />
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Link to="/dashboard/cpdmanagement">
              <AppWidgetSummary title="CPD Management" color="info" icon={'eos-icons:content-lifecycle-management'} />
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Link to="/dashboard/managecpd">
              <AppWidgetSummary title="Manage CPD" color="warning" icon={'material-symbols:folder-managed-sharp'} />
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Link to="/dashboard/addcpd">
              <AppWidgetSummary title="Add CPD" color="error" icon={'material-symbols:add-card-rounded'} />
            </Link>
          </Grid>
          {/* <div className="dashboard_section"> */}
          <Grid item xs={12} md={6} lg={6}>
            <div className="membership-option">
              <div className="cardSection">
                <h3>Membership</h3>
                <span>
                  <img height={40} width={40} src={medal} alt="medal" />

                  <h4>Professional Membership</h4>
                </span>
                <p className="certificate_date">Membership through 12/04/2022</p>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <div className="certificate">
              <div className="cardSection">
                <h3>Certificate</h3>
                <span>
                  <img height={40} width={40} src={cisaLogo} alt="cisa_logo" />
                  <h4>CISA Certificate</h4>
                </span>
                <p className="certificate_date">Certified through 12/04/2022</p>
              </div>
            </div>
          </Grid>
          {/* </div> */}
        </Grid>
      </Container>
    </>
  );
}
