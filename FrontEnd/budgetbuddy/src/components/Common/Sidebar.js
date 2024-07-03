import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Sidebar = ({ variant, open, toggleDrawer, drawerWidth }) => {
  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={toggleDrawer}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <StyledTitle>BudgetBuddy</StyledTitle>
      <List>
        <ListItem component={Link} to="dashboard" onClick={toggleDrawer}>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem component={Link} to="budget" onClick={toggleDrawer}>
          <ListItemText primary="Budget" />
        </ListItem>
        <ListItem component={Link} to="expenses" onClick={toggleDrawer}>
          <ListItemText primary="Expenses" />
        </ListItem>
      </List>
    </Drawer>
  );
}


const StyledTitle = styled.h2`
  padding: 10px;
`;