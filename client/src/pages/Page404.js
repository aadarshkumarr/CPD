import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';

// ----------------------------------------------------------------------

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Page404() {
  const userData = localStorage.getItem('user');
  const userDetails = JSON.parse(userData);
  const userRole = userDetails.role;

  return (
    <>
      {userRole === 'user' ? (
        <div className="user">
          <Helmet>
            <title>404 Page Not Found</title>
          </Helmet>

          <Container>
            <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
              <Typography variant="h3" paragraph>
                Sorry, page not found!
              </Typography>

              <Typography sx={{ color: 'text.secondary' }}>
                Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check
                your spelling.
              </Typography>

              <Box
                component="img"
                src="/assets/illustrations/illustration_404.svg"
                sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
              />

              <Button to="/" size="large" variant="contained" component={RouterLink}>
                Go to Home
              </Button>
            </StyledContent>
          </Container>
        </div>
      ) : userRole === 'admin' || userRole === 'management' ? (
        <div className="admin">
          <Helmet>
            <title>404 Page Not Found</title>
          </Helmet>

          <Container>
            <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
              <Typography variant="h3" paragraph>
                Sorry, page not found!
              </Typography>

              <Typography sx={{ color: 'text.secondary' }}>
                Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check
                your spelling.
              </Typography>

              <Box
                component="img"
                src="/assets/illustrations/illustration_404.svg"
                sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
              />

              <Button to="/adminPage" size="large" variant="contained" component={RouterLink}>
                Go to Home
              </Button>
            </StyledContent>
          </Container>
        </div>
      ) : null}
    </>
  );
}