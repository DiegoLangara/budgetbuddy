import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faFolder, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import logo from '../../Assets/Logonn.png';

export const Sidebar = ({ variant, open, toggleDrawer, drawerWidth }) => {
  return (
    <StyledDrawer
      variant={variant}
      open={open}
      onClose={toggleDrawer}
      drawerWidth={drawerWidth}
    >
      <StyledTitle>
        <img src={logo} alt="Budget Buddy Logo" />
      </StyledTitle>
      <List>
        <StyledListItem component={Link} to="dashboard" onClick={toggleDrawer}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faHome} color="white" />
          </ListItemIcon>
          <StyledListItemText primary="Dashboard" />
        </StyledListItem>
        <StyledListItem component={Link} to="budget" onClick={toggleDrawer}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faFolder} color="white" />
          </ListItemIcon>
          <StyledListItemText primary="Budget" />
        </StyledListItem>
        <StyledListItem component={Link} to="expenses" onClick={toggleDrawer}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faDollarSign} color="white" />
          </ListItemIcon>
          <StyledListItemText primary="Expenses" />
        </StyledListItem>
      </List>
      <Footer>
        &copy; 2024 Budget Buddy
      </Footer>
    </StyledDrawer>
  );
}

const StyledDrawer = styled(Drawer)`
  position: absolute;
  height: 100%;
  width: 60px;
  flex-shrink: 0;
  white-space: nowrap;
  overflow-x: hidden;
  transition: width 0.3s;
  z-index: 1300;  /* Ensure it is on top of other content */
  & .MuiDrawer-paper {
    width: 60px;
    transition: width 0.3s;
    box-sizing: border-box;
    background-color: #3A608F;
    color: #fff;
    overflow-x: hidden;  /* Prevents horizontal scroll */
  }
  &:hover {
    width: ${props => props.drawerWidth}px;
    & .MuiDrawer-paper {
      width: ${props => props.drawerWidth}px;
    }
  }
`;

const StyledTitle = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
  img {
    width: 100%;
    max-width: 40px;
  }
`;

const StyledListItem = styled(ListItem)`
  color: white;
  text-decoration: none !important;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const StyledListItemText = styled(ListItemText)`
  opacity: 0;
  transition: opacity 0.3s;
  ${StyledDrawer}:hover & {
    opacity: 1;
  }
  & .MuiTypography-root {
    color: white;
  }
`;

const Footer = styled.div`
  margin-top: auto;
  padding: 10px;
  text-align: center;
  color: #fff;
  font-size: 12px;
`;
