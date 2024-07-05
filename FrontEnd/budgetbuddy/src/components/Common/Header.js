import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Avatar, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PrintIcon from '@mui/icons-material/Print';
import { useMediaQuery } from '@mui/material';
import styled from 'styled-components';

export const Header = ({ toggleDrawer }) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <HeaderContainer>
      <StyledAppBar position="static">
        <StyledToolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}
          <WelcomeMessage>
            <Typography variant="body1" component="div">
              Welcome back buddy!
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              Davis
            </Typography>
          </WelcomeMessage>
          <Spacer />
          <Button
            variant="contained"
            sx={{ backgroundColor: 'black', color: 'white', margin: '2rem' }}
            startIcon={<PrintIcon />}
          >
            Print
          </Button>
          <Avatar src="/path-to-avatar-image.jpg" alt="User Avatar" />
        </StyledToolbar>
      </StyledAppBar>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  padding: 3vh 16.5vw 0 16.5vw; /* Ajusta el espacio según sea necesario */
  margin: 0 auto;
`;

const StyledAppBar = styled(AppBar)`
  background-color: #3A608F !important;
  border-radius: 10px;
  padding: 0 16px; /* Padding dentro del AppBar */
`;

const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  min-height: 64px;
`;

const WelcomeMessage = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

export default Header;
