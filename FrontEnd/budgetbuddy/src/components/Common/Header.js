import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Avatar, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PrintIcon from '@mui/icons-material/Print';
import { useMediaQuery } from '@mui/material';
import styled from 'styled-components';
import { useAuth } from "../../contexts/AuthContext";

export const Header = ({ toggleDrawer }) => {
  const { currentUser } = useAuth();
  const token = currentUser.token;
  const user_id = currentUser.id;
  const [user, setUser] = useState({});
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/user/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: token,
              user_id: user_id,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [token, user_id]);

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
              {user.firstname}
            </Typography>
          </WelcomeMessage>
          <Spacer />
          <Button
            variant="contained"
            sx={{ backgroundColor: 'black', color: 'white', marginRight: '16px' }}
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
  padding: 1rem 3rem; 
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