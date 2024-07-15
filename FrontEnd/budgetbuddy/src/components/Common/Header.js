import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Avatar, Button, Menu, MenuItem, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PrintIcon from '@mui/icons-material/Print';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { useMediaQuery } from '@mui/material';
import styled from 'styled-components';
import { useAuth } from "../../contexts/AuthContext";
import { Profile } from '../Profile/Profile';
// import './Header.css';

export const Header = ({ toggleDrawer }) => {
  const { currentUser } = useAuth();
  const token = currentUser.token;
  const user_id = currentUser.id;
  const [user, setUser] = useState({});
  const isMobile = useMediaQuery('(max-width:600px)');

  const [showProfile, setShowProfile] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleProfile = () => {
    setShowProfile(!showProfile);
    handleMenuClose();
  };

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
              <MenuIcon style={{ fontSize: '2.5vh' }} />
            </IconButton>
          )}
          <WelcomeMessage>
            <Typography variant="body1" component="div">
              Welcome back buddy!
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', fontSize: '3vh' }}>
              {user.firstname}
            </Typography>
          </WelcomeMessage>
          <Spacer />
          <Button
            variant="contained"
            sx={{ backgroundColor: 'black', color: 'white', marginRight: '2vw' }}
            startIcon={<PrintIcon style={{ fontSize: '2.5vh' }} />}
          >
            Print
          </Button>
          <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
            <Avatar src="/path-to-avatar-image.jpg" alt="User Avatar" style={{ width: '5vh', height: '5vh' }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <p style={{ margin: '2vh', color: 'black' }}>My Account</p>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleToggleProfile}>
              <StyledPersonIcon />{user.firstname} {user.lastname}
            </MenuItem>
            <MenuItem><StyledSettingsIcon />Settings</MenuItem>
            <MenuItem><StyledVerifiedUserIcon />Account Security</MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem><StyledMenuBookIcon />Terms and Conditions</MenuItem>
            <MenuItem><StyledMenuBookIcon />Privacy Policy</MenuItem>
            <MenuItem><StyledNotificationsIcon />Notifications</MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem><StyledLogoutIcon />Logout</MenuItem>
          </Menu>
        </StyledToolbar>
      </StyledAppBar>
      <Profile open={showProfile} onClose={handleToggleProfile} />
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  width: 100%;
  padding: 3vh 10vw 0 calc(10vw + 5vw);
  margin: 0 auto;
`;

const StyledAppBar = styled(AppBar)`
  background-color: #3A608F !important;
  border-radius: 1vh;
  padding: 1vh 3vw;
`;

const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  min-height: 10vh;
`;

const WelcomeMessage = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

const StyledPersonIcon = styled(PersonIcon)`
  margin-right: 0.5vw;
  font-size: 2.5vh;
`;

const StyledSettingsIcon = styled(SettingsIcon)`
  margin-right: 0.5vw;
  font-size: 2.5vh;
`;

const StyledVerifiedUserIcon = styled(VerifiedUserIcon)`
  margin-right: 0.5vw;
  font-size: 2.5vh;
`;

const StyledMenuBookIcon = styled(MenuBookIcon)`
  margin-right: 0.5vw;
  font-size: 2.5vh;
`;

const StyledNotificationsIcon = styled(NotificationsIcon)`
  margin-right: 0.5vw;
  font-size: 2.5vh;
`;

const StyledLogoutIcon = styled(LogoutIcon)`
  margin-right: 0.5vw;
  font-size: 2.5vh;
`;

export default Header;
