import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Avatar, Button, Menu, MenuItem, Divider, useMediaQuery, useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import PrintIcon from '@mui/icons-material/Print';
import styled from 'styled-components';
import { useAuth } from "../../contexts/AuthContext";
import { Profile } from '../Profile/Profile';

export const Header = ({ toggleDrawer }) => {
  const { currentUser } = useAuth();
  const token = currentUser.token;
  const user_id = currentUser.id;
  const [user, setUser] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showProfile, setShowProfile] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();

  const getHeaderTitle = (pathname) => {
    switch (pathname) {
      case '/budget':
        return 'Budget';
      case '/expenses':
        return 'Transactions';
      default:
        return 'Welcome back buddy!';
    }
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

  const headerTitle = getHeaderTitle(location.pathname);

  return (
    <HeaderContainer isMobile={isMobile}>
      <StyledAppBar position="static">
        <StyledToolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
              <MenuIcon style={{ fontSize: '2.5vh' }} />
            </IconButton>
          )}
          {headerTitle === 'Welcome back buddy!' ? (
            <WelcomeMessage>
              <Typography variant="body1" component="div">
                Welcome back buddy!
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', fontSize: '3vh' }}>
                {user.firstname}
              </Typography>
            </WelcomeMessage>
          ) : (
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', fontSize: '3vh' }}>
              {headerTitle}
            </Typography>
          )}
          <Spacer />
          {!isMobile && (
            <Button
              variant="contained"
              sx={{ backgroundColor: 'black', color: 'white', marginRight: '2vw' }}
              startIcon={<PrintIcon style={{ fontSize: '2.5vh' }} />}
            >
              Print
            </Button>
          )}
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
              <StyledIcon width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/StyledIcon">
                <g clip-path="url(#clip0_3917_7585)">
                  <path d="M14.9547 15.9125L14.9547 15.9125C15.0549 15.9595 15.1639 15.9826 15.2726
                   15.9826C15.4023 15.9826 15.5321 15.9494 15.6463 15.8835C15.8557 15.7625 15.9826
                   15.5495 15.9826 15.3204V10.8311C15.9826 10.2884 15.5427 9.84841 15 9.84841H14.4325C14.1192
                   9.84841 13.8245 9.99737 13.6168 10.2334C12.8473 11.1077 10.751 13.1481 7.93964
                   13.1481H7.6694C4.92178 13.1481 3.08331 11.1994 2.37748 10.2944C2.16682 10.0243
                   1.84995 9.84841 1.50889 9.84841H1C0.4573 9.84841 0.0173541 10.2884 0.0173541
                   10.8311V11.3944C0.0173541 12.3188 0.017803 12.8225 0.27082 13.2859L0.270825
                   13.286C0.495039 13.6972 0.846333 14.0258 1.28716 14.2355L1.28717 14.2355C1.78393
                   14.472 2.32367 14.4724 3.31304 14.4724H11.43H11.4329C11.6177 14.4724 11.7221
                   14.4724 11.7841 14.4805L11.7841 14.4806L14.9547 15.9125ZM14.9547 15.9125L12.2685
                   14.6574M14.9547 15.9125L12.2685 14.6574M12.2685 14.6574C12.0889 14.5735 12.0054
                   14.5347 11.9476 14.5168L12.2685 14.6574Z" fill="black" stroke="#334155" stroke-width="0.0347081"
                  />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.99963 1.97209C6.794 1.97209
                   5.81665 2.88528 5.81665 4.01177C5.81665 5.13825 6.794 6.05144 7.99963 6.05144C9.20526
                   6.05144 10.1826 5.13825 10.1826 4.01177C10.1826 2.88528 9.20526 1.97209 7.99963
                   1.97209ZM4.36133 4.01177C4.36133 2.1343 5.99025 0.612305 7.99963 0.612305C10.009 
                   0.612305 11.6379 2.1343 11.6379 4.01177C11.6379 5.88924 10.009 7.41123 7.99963 
                   7.41123C5.99025 7.41123 4.36133 5.88924 4.36133 4.01177Z" fill="black"
                  />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M1.28459 9.56273C1.94482 8.10935 
                   3.48694 7.08789 5.28606 7.08789H10.7126C12.5118 7.08789 14.0539 8.10935 14.7141 
                   9.56273C14.8711 9.90838 14.6985 10.3075 14.3286 10.4542C13.9586 10.6009 13.5315 
                   10.4397 13.3745 10.094C12.9343 9.12512 11.9073 8.44768 10.7126 8.44768H5.28606C4.09138 
                   8.44768 3.06437 9.12512 2.62423 10.094C2.46721 10.4397 2.04004 10.6009 1.6701 
                   10.4542C1.30017 10.3075 1.12757 9.90838 1.28459 9.56273Z" fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3917_7585">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </StyledIcon>
              {user.firstname} {user.lastname}
            </MenuItem>
            <MenuItem>
              <StyledIcon width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/StyledIcon">
                <g clip-path="url(#clip0_3917_7599)">
                  <path d="M8.00065 9.99967C9.10522 9.99967 10.0007 9.10424 10.0007 7.99967C10.0007 
                   6.89511 9.10522 5.99967 8.00065 5.99967C6.89608 5.99967 6.00065 6.89511 6.00065 
                   7.99967C6.00065 9.10424 6.89608 9.99967 8.00065 9.99967Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  />
                  <path d="M12.4855 9.81786C12.4048 10.0007 12.3808 10.2034 12.4164 10.4C12.4521 
                    10.5966 12.5458 10.7781 12.6855 10.9209L12.7219 10.9573C12.8346 11.0698 12.924 
                    11.2035 12.985 11.3507C13.046 11.4978 13.0774 11.6555 13.0774 11.8148C13.0774 
                    11.9741 13.046 12.1318 12.985 12.279C12.924 12.4261 12.8346 12.5598 12.7219 
                    12.6724C12.6093 12.7851 12.4756 12.8745 12.3285 12.9355C12.1813 12.9965 12.0236 
                    13.0279 11.8643 13.0279C11.705 13.0279 11.5473 12.9965 11.4001 12.9355C11.253 
                    12.8745 11.1193 12.7851 11.0067 12.6724L10.9703 12.636C10.8275 12.4963 10.6461 
                    12.4026 10.4495 12.3669C10.2529 12.3313 10.0501 12.3554 9.86732 12.436C9.68806 
                    12.5129 9.53519 12.6404 9.4275 12.803C9.31982 12.9656 9.26204 13.1562 9.26126 
                    13.3512V13.4542C9.26126 13.7757 9.13355 14.084 8.90623 14.3113C8.67892 14.5386 
                    8.37061 14.6663 8.04914 14.6663C7.72766 14.6663 7.41935 14.5386 7.19204 14.3113C6.96472 
                    14.084 6.83701 13.7757 6.83701 13.4542V13.3997C6.83232 13.1991 6.76739 13.0045 
                    6.65066 12.8413C6.53393 12.6781 6.37079 12.5538 6.18247 12.4845C5.99967 12.4038 
                    5.7969 12.3798 5.60029 12.4154C5.40369 12.4511 5.22227 12.5448 5.07944 12.6845L5.04308 
                    12.7209C4.9305 12.8336 4.79682 12.923 4.64967 12.984C4.50252 13.045 4.34479 13.0764 
                    4.1855 13.0764C4.02621 13.0764 3.86848 13.045 3.72133 12.984C3.57418 12.923 3.4405 
                    12.8336 3.32792 12.7209C3.21523 12.6083 3.12582 12.4746 3.06482 12.3275C3.00382 
                    12.1803 2.97242 12.0226 2.97242 11.8633C2.97242 11.704 3.00382 11.5463 3.06482 
                    11.3991C3.12582 11.252 3.21523 11.1183 3.32792 11.0057L3.36429 10.9694C3.50401 
                    10.8265 3.59773 10.6451 3.63338 10.4485C3.66903 10.2519 3.64496 10.0491 3.56429 
                    9.86634C3.48746 9.68709 3.3599 9.53421 3.1973 9.42653C3.0347 9.31885 2.84416 
                    9.26106 2.64914 9.26028H2.54611C2.22463 9.26028 1.91632 9.13258 1.68901 8.90526C1.46169 
                    8.67794 1.33398 8.36963 1.33398 8.04816C1.33398 7.72668 1.46169 7.41838 1.68901 
                    7.19106C1.91632 6.96374 2.22463 6.83604 2.54611 6.83604H2.60065C2.80125 6.83135 
                    2.99581 6.76641 3.15901 6.64968C3.32222 6.53295 3.44654 6.36982 3.5158 6.18149C3.59648 5.9987 3.62054 5.79592 3.5849 5.59932C3.54925 5.40271 3.45552 5.2213 3.3158 5.07846L3.27944 5.0421C3.16674 4.92953 3.07734 4.79584 
                    3.01634 4.64869C2.95534 4.50154 2.92394 4.34381 2.92394 4.18452C2.92394 4.02523 
                    2.95534 3.8675 3.01634 3.72035C3.07734 3.5732 3.16674 3.43952 3.27944 3.32695C3.39201 
                    3.21425 3.5257 3.12484 3.67284 3.06384C3.81999 3.00285 3.97772 2.97145 4.13701 
                    2.97145C4.29631 2.97145 4.45404 3.00285 4.60118 3.06384C4.74833 3.12484 4.88202 
                    3.21425 4.99459 3.32695L5.03095 3.36331C5.17379 3.50303 5.35521 3.59676 5.55181 
                    3.6324C5.74841 3.66805 5.95119 3.64399 6.13398 3.56331H6.18247C6.36172 3.48648 
                    6.5146 3.35892 6.62228 3.19632C6.72997 3.03372 6.78775 2.84318 6.78853 2.64816V2.54513C6.78853 
                    2.22365 6.91624 1.91535 7.14355 1.68803C7.37087 1.46071 7.67918 1.33301 8.00065 
                    1.33301C8.32213 1.33301 8.63043 1.46071 8.85775 1.68803C9.08507 1.91535 9.21277 
                    2.22365 9.21277 2.54513V2.59967C9.21355 2.7947 9.27134 2.98524 9.37902 3.14784C9.4867 
                    3.31044 9.63958 3.438 9.81883 3.51483C10.0016 3.5955 10.2044 3.61957 10.401 
                    3.58392C10.5976 3.54827 10.779 3.45455 10.9219 3.31483L10.9582 3.27846C11.0708 
                    3.16576 11.2045 3.07636 11.3516 3.01536C11.4988 2.95436 11.6565 2.92296 11.8158 
                    2.92296C11.9751 2.92296 12.1328 2.95436 12.28 3.01536C12.4271 3.07636 12.5608 
                    3.16576 12.6734 3.27846C12.7861 3.39104 12.8755 3.52472 12.9365 3.67187C12.9975 
                    3.81902 13.0289 3.97675 13.0289 4.13604C13.0289 4.29533 12.9975 4.45306 12.9365 
                    4.60021C12.8755 4.74736 12.7861 4.88104 12.6734 4.99361L12.637 5.02998C12.4973 
                    5.17281 12.4036 5.35423 12.3679 5.55083C12.3323 5.74744 12.3563 5.95021 12.437 
                    6.13301V6.18149C12.5138 6.36075 12.6414 6.51362 12.804 6.62131C12.9666 6.72899 
                    13.1571 6.78678 13.3522 6.78755H13.4552C13.7767 6.78755 14.085 6.91526 14.3123 
                    7.14258C14.5396 7.36989 14.6673 7.6782 14.6673 7.99967C14.6673 8.32115 14.5396 
                    8.62946 14.3123 8.85677C14.085 9.08409 13.7767 9.2118 13.4552 9.2118H13.4007C13.2056 
                    9.21257 13.0151 9.27036 12.8525 9.37804C12.6899 9.48573 12.5623 9.6386 12.4855 9.81786Z"
                    stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3917_7599">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </StyledIcon>

              Settings</MenuItem>
            <MenuItem>
              <StyledIcon width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/StyledIcon">
                <g clip-path="url(#clip0_3917_7606)">
                  <path d="M6.25786 7.99991L7.33268 8.99991L10.3327 5.99991M13.3327 7.99991C13.3327 
                    11.2722 9.76338 14.3188 8.46468 15.0765C8.31708 15.1626 8.24328 15.2057 8.13914 
                    15.228C8.05831 15.2453 7.94039 15.2453 7.85956 15.228C7.75541 15.2057 7.68162 
                    15.1626 7.53402 15.0765C6.23532 14.3188 2.66602 11.2722 2.66602 7.99991V4.81165C2.66602 
                    4.27864 2.66602 4.01214 2.75319 3.78305C2.8302 3.58067 2.95534 3.4001 3.11779 
                    3.25693C3.27105 3.12187 3.46991 3.03437 3.82084 2.90062C3.91293 2.86552 3.95898 
                    2.84797 3.9996 2.83039C4.03701 2.8142 4.07005 2.79873 4.10645 2.78037C4.14596 
                    2.76043 4.18529 2.73834 4.26396 2.69417L7.51798 0.86702C7.55952 0.843696 7.58029 
                    0.832034 7.60282 0.820831C7.62108 0.811758 7.64505 0.800828 7.66387 0.793C7.68711 
                    0.783333 7.70466 0.777049 7.73975 0.764481C7.80835 0.739915 7.85572 0.725744 7.904 
                    0.718767C7.96724 0.70963 8.03146 0.70963 8.09469 0.718767C8.14298 0.725744 8.19034 
                    0.739915 8.25894 0.764481C8.29404 0.777049 8.31159 0.783333 8.33483 0.793C8.35365 
                    0.800828 8.37762 0.811758 8.39587 0.820831C8.41841 0.832034 8.43918 0.843696 8.48072 
                    0.86702L11.7347 2.69417C11.8134 2.73834 11.8527 2.76043 11.8923 2.78037C11.9286 2.79873 
                    11.9617 2.8142 11.9991 2.83039C12.0397 2.84797 12.0858 2.86552 12.1779 2.90062C12.5288 
                    3.03437 12.7276 3.12187 12.8809 3.25693C13.0434 3.4001 13.1685 3.58067 13.2455 
                    3.78305C13.3327 4.01214 13.3327 4.27864 13.3327 4.81165V7.99991Z"
                    stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3917_7606">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </StyledIcon>
              Account Security</MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem>
              <StyledIcon width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/StyledIcon">
                <path d="M8.00065 13.3337H3.46732C2.72058 13.3337 2.34721 13.3337 2.062 13.1883C1.81111 
                  13.0605 1.60714 12.8565 1.47931 12.6056C1.33398 12.3204 1.33398 11.9471 1.33398 
                  11.2003V4.80033C1.33398 4.05359 1.33398 3.68022 1.47931 3.395C1.60714 3.14412 1.81111 
                  2.94015 2.062 2.81232C2.34721 2.66699 2.72058 2.66699 3.46732 2.66699H3.73398C5.22746 
                  2.66699 5.97419 2.66699 6.54463 2.95764C7.04639 3.2133 7.45434 3.62125 7.71 
                  4.12302C8.00065 4.69345 8.00065 5.44019 8.00065 6.93366M8.00065 13.3337V6.93366M8.00065 
                  13.3337H12.534C13.2807 13.3337 13.6541 13.3337 13.9393 13.1883C14.1902 13.0605 14.3942 
                  12.8565 14.522 12.6056C14.6673 12.3204 14.6673 11.9471 14.6673 11.2003V4.80033C14.6673 
                  4.05359 14.6673 3.68022 14.522 3.395C14.3942 3.14412 14.1902 2.94015 13.9393 
                  2.81232C13.6541 2.66699 13.2807 2.66699 12.534 2.66699H12.2673C10.7738 2.66699 
                  10.0271 2.66699 9.45668 2.95764C8.95491 3.2133 8.54696 3.62125 8.2913 4.12302C8.00065 
                  4.69345 8.00065 5.44019 8.00065 6.93366"
                  stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M1.33398 5.60156H4.7997M7.5319 5.60156H4.7997M4.7997 5.60156V12.7305" stroke="black" stroke-width="2"
                />
                <path d="M14.6674 6.76099C14.0036 6.04771 13.0565 5.60156 12.0052 5.60156C9.99706 5.60156 8.36914 7.22949 8.36914 9.23763C8.36914 11.2458 9.99706 12.8737 12.0052 12.8737C13.0565 12.8737 14.0036 12.4276 14.6674 11.7143" stroke="black" stroke-width="2" />
                <rect x="8.45898" y="11.7988" width="0.988933" height="1.07454" fill="black" />
              </StyledIcon>
              Terms and Conditions</MenuItem>
            <MenuItem>
              <StyledIcon width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/StyledIcon">
                <path d="M8.00065 13.3337H3.46732C2.72058 13.3337 2.34721 13.3337 2.062 13.1883C1.81111 
                  13.0605 1.60714 12.8565 1.47931 12.6056C1.33398 12.3204 1.33398 11.9471 1.33398 
                  11.2003V4.80033C1.33398 4.05359 1.33398 3.68022 1.47931 3.395C1.60714 3.14412 1.81111 
                  2.94015 2.062 2.81232C2.34721 2.66699 2.72058 2.66699 3.46732 2.66699H3.73398C5.22746 
                  2.66699 5.97419 2.66699 6.54463 2.95764C7.04639 3.2133 7.45434 3.62125 7.71 
                  4.12302C8.00065 4.69345 8.00065 5.44019 8.00065 6.93366M8.00065 13.3337V6.93366M8.00065 
                  13.3337H12.534C13.2807 13.3337 13.6541 13.3337 13.9393 13.1883C14.1902 13.0605 14.3942 
                  12.8565 14.522 12.6056C14.6673 12.3204 14.6673 11.9471 14.6673 11.2003V4.80033C14.6673 
                  4.05359 14.6673 3.68022 14.522 3.395C14.3942 3.14412 14.1902 2.94015 13.9393 
                  2.81232C13.6541 2.66699 13.2807 2.66699 12.534 2.66699H12.2673C10.7738 2.66699 
                  10.0271 2.66699 9.45668 2.95764C8.95491 3.2133 8.54696 3.62125 8.2913 4.12302C8.00065 
                  4.69345 8.00065 5.44019 8.00065 6.93366"
                  stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M1.33398 5.60156H4.7997M7.5319 5.60156H4.7997M4.7997 5.60156V12.7305" stroke="black" stroke-width="2"
                />
                <path d="M14.6674 6.76099C14.0036 6.04771 13.0565 5.60156 12.0052 5.60156C9.99706 5.60156 8.36914 7.22949 8.36914 9.23763C8.36914 11.2458 9.99706 12.8737 12.0052 12.8737C13.0565 12.8737 14.0036 12.4276 14.6674 11.7143" stroke="black" stroke-width="2" />
                <rect x="8.45898" y="11.7988" width="0.988933" height="1.07454" fill="black" />
              </StyledIcon>
              Privacy Policy</MenuItem>
            <MenuItem>
              <StyledIcon width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/StyledIcon">
                <g clip-path="url(#clip0_3917_7638)">
                  <path d="M12.1194 6.13366C12.1194 5.21424 11.6854 4.33248 10.9129 3.68236C10.1403
                    3.03223 9.09254 2.66699 8 2.66699C6.90745 2.66699 5.85966 3.03223 5.08711 3.68236C4.31456 
                    4.33248 3.88055 5.21424 3.88055 6.13366C3.88055 7.9191 3.34534 9.14154 2.74747 
                    9.95012C2.24316 10.6322 1.991 10.9732 2.00025 11.0683C2.01048 11.1737 2.037 
                    11.2138 2.13787 11.2768C2.22897 11.3337 2.63963 11.3337 3.46095 11.3337H12.539C13.3604 
                    11.3337 13.771 11.3337 13.8621 11.2768C13.963 11.2138 13.9895 11.1737 13.9998 
                    11.0683C14.009 10.9732 13.7568 10.6322 13.2525 9.95012C12.6547 9.14155 12.1194 
                    7.9191 12.1194 6.13366Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  />
                  <path d="M9.19585 1.10644C8.52693 0.680579 7.6724 0.651987 6.97651 1.03219" stroke="black" stroke-width="1.63903" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M6.6674 13.1729C7.50055 13.665 8.54386 13.665 9.37702 13.1729" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </g>
                <defs>
                  <clipPath id="clip0_3917_7638">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </StyledIcon>
              Notifications</MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem>
              <StyledIcon width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/StyledIcon">
                <path d="M10.6667 11.3333L14 8M14 8L10.6667 4.66667M14 8H6M6 2H5.2C4.0799 2 3.51984 2 
                  3.09202 2.21799C2.7157 2.40973 2.40973 2.71569 2.21799 3.09202C2 3.51984 2 4.07989 2 
                  5.2V10.8C2 11.9201 2 12.4802 2.21799 12.908C2.40973 13.2843 2.71569 13.5903 3.09202 
                  13.782C3.51984 14 4.0799 14 5.2 14H6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                />
              </StyledIcon>
              Logout</MenuItem>
          </Menu>
        </StyledToolbar>
      </StyledAppBar>
      <Profile open={showProfile} onClose={handleToggleProfile} />
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.div`
  width: 97%;
  padding: ${(props) => (props.isMobile ? "1vh" : "2vh 10vw 3vh calc(10vw + 5.3vw)")};
  margin: 0 auto;
`;

const StyledAppBar = styled(AppBar)`
  background-color: #3A608F !important;
  border-radius: 1vh;
  padding: 1vh;
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

const StyledIcon = styled.svg`
  margin-right: 1vw;
  cursor: pointer;
`;