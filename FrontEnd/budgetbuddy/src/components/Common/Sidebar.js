import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faFolder, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import logo from '../../Assets/Logonn.png';
import '../../css/Sidebar.css';

export const Sidebar = ({ variant, open, toggleDrawer, drawerWidth }) => {
  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={toggleDrawer}
      className="styled-drawer"
      style={{ '--drawer-width': '12vw' }}
    >
      <div className="styled-title">
        <img src={logo} alt="Budget Buddy Logo" />
      </div>
      <List>
        <ListItem component={Link} to="dashboard" onClick={toggleDrawer} className="styled-list-item">
          <ListItemIcon>
            <FontAwesomeIcon icon={faHome} color="white" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" className="styled-list-item-text" />
        </ListItem>
        <ListItem component={Link} to="budget" onClick={toggleDrawer} className="styled-list-item">
          <ListItemIcon>
            <FontAwesomeIcon icon={faFolder} color="white" />
          </ListItemIcon>
          <ListItemText primary="Budget" className="styled-list-item-text" />
        </ListItem>
        <ListItem component={Link} to="expenses" onClick={toggleDrawer} className="styled-list-item">
          <ListItemIcon>
            <FontAwesomeIcon icon={faDollarSign} color="white" />
          </ListItemIcon>
          <ListItemText primary="Expenses" className="styled-list-item-text" />
        </ListItem>
      </List>
      <div className="footerSidebar">
        &copy; 2024<br />
         BBuddy
      </div>
    </Drawer>
  );
}
