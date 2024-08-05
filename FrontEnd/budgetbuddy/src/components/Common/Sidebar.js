import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../../Assets/Logonn.png';
import '../../css/Sidebar.css';

export const Sidebar = ({ variant, open, toggleDrawer, drawerWidth }) => {
  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={toggleDrawer}
      className="styled-drawer"
     
    >
      <div className="styled-title">
        <img src={logo} alt="Budget Buddy Logo" />
      </div>
      <div className="ListDiv">
        <List>
          <ListItem component={Link} to="dashboard" onClick={toggleDrawer} className="styled-list-item">
            <ListItemIcon>
              <svg
                
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="home" clipPath="url(#clip0_3836_6691)">
                  <path
                    id="Icon"
                    d="M2 7.04386C2 6.66095 2 6.4695 2.04935 6.29319C2.09307 6.13701 2.16491 5.99012 2.26135 5.85973C2.37022 5.71252 2.52135 5.59498 2.82359 5.3599L7.34513 1.84315C7.57935 1.66099 7.69646 1.5699 7.82577 1.53489C7.93987 1.504 8.06013 1.504 8.17423 1.53489C8.30354 1.5699 8.42065 1.66099 8.65487 1.84315L13.1764 5.35991C13.4787 5.59499 13.6298 5.71252 13.7386 5.85973C13.8351 5.99012 13.9069 6.13701 13.9506 6.29319C14 6.4695 14 6.66095 14 7.04386V11.8671C14 12.6139 14 12.9872 13.8547 13.2725C13.7268 13.5233 13.5229 13.7273 13.272 13.8552C12.9868 14.0005 12.6134 14.0005 11.8667 14.0005H4.13333C3.3866 14.0005 3.01323 14.0005 2.72801 13.8552C2.47713 13.7273 2.27316 13.5233 2.14532 13.2725C2 12.9872 2 12.6139 2 11.8671V7.04386Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector"
                    d="M6 14.6663V11.1108C6 10.5182 6.36364 9.33301 7.81818 9.33301H8.18182C9.63636 9.33301 10 10.5182 10 11.1108V14.6663"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <path
                    id="Vector_2"
                    d="M9.82712 2.44701C9.82712 1.94026 10.1381 0.926758 11.3819 0.926758H11.6929C12.9367 0.926758 13.2477 1.94026 13.2477 2.44701V5.48752"
                    stroke="white"
                    strokeWidth="2"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3836_6691">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </ListItemIcon>
            <ListItemText primary="Home" className="styled-list-item-text" />
          </ListItem>
          <ListItem component={Link} to="budget" onClick={toggleDrawer} className="styled-list-item">
            <ListItemIcon>
              <svg
               
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="budget">
                  <path
                    id="Icon"
                    d="M14.6667 5.66699H1.33334M1.33334 8.33366H3.69779C4.05792 8.33366 4.23799 8.33366 4.4121 8.3647C4.56665 8.39224 4.71741 8.43789 4.86128 8.5007C5.02337 8.57145 5.17319 8.67134 5.47284 8.8711L5.86052 9.12955C6.16016 9.32932 6.30998 9.4292 6.47207 9.49995C6.61594 9.56276 6.76671 9.60841 6.92125 9.63596C7.09537 9.66699 7.27543 9.66699 7.63556 9.66699H8.36446C8.72459 9.66699 8.90465 9.66699 9.07877 9.63596C9.23331 9.60841 9.38408 9.56276 9.52795 9.49995C9.69004 9.4292 9.83986 9.32932 10.1395 9.12955L10.5272 8.8711C10.8268 8.67134 10.9767 8.57145 11.1387 8.5007C11.2826 8.43789 11.4334 8.39224 11.5879 8.3647C11.762 8.33366 11.9421 8.33366 12.3022 8.33366H14.6667M1.33334 4.80033L1.33334 11.2003C1.33334 11.9471 1.33334 12.3204 1.47867 12.6056C1.6065 12.8565 1.81047 13.0605 2.06136 13.1883C2.34657 13.3337 2.71994 13.3337 3.46668 13.3337L12.5333 13.3337C13.2801 13.3337 13.6534 13.3337 13.9387 13.1883C14.1895 13.0605 14.3935 12.8565 14.5214 12.6056C14.6667 12.3204 14.6667 11.9471 14.6667 11.2003V4.80033C14.6667 4.05359 14.6667 3.68022 14.5214 3.39501C14.3935 3.14412 14.1895 2.94015 13.9387 2.81232C13.6534 2.66699 13.2801 2.66699 12.5333 2.66699L3.46668 2.66699C2.71994 2.66699 2.34657 2.66699 2.06136 2.81232C1.81047 2.94015 1.6065 3.14412 1.47867 3.395C1.33334 3.68022 1.33334 4.05359 1.33334 4.80033Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </ListItemIcon>
            <ListItemText primary="Budget" className="styled-list-item-text" />
          </ListItem>
          <ListItem component={Link} to="expenses" onClick={toggleDrawer} className="styled-list-item">
            <ListItemIcon>
              <svg
               
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="expenses" clipPath="url(#clip0_3836_6707)">
                  <path
                    id="Icon"
                    d="M8.00001 14.6663C4.31811 14.6663 1.33334 11.6816 1.33334 7.99967C1.33334 4.31778 4.31811 1.33301 8.00001 1.33301"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Icon_2"
                    d="M7.99999 4.66699H8.77777C9.63688 4.66699 10.3333 5.36344 10.3333 6.22255M7.99999 4.66699H7.33332C6.41285 4.66699 5.66666 5.41318 5.66666 6.33366C5.66666 7.25413 6.41285 8.00033 7.33332 8.00033H8.66666C9.58713 8.00033 10.3333 8.74652 10.3333 9.66699C10.3333 10.5875 9.58713 11.3337 8.66666 11.3337H7.99999M7.99999 4.66699V3.66699M7.99999 11.3337H7.22221C6.3631 11.3337 5.66666 10.6372 5.66666 9.7781M7.99999 11.3337V12.3337"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Icon_3"
                    d="M13.9445 10.0003L15.3333 8.33366L13.9445 6.66699"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3836_6707">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </ListItemIcon>
            <ListItemText primary="Transactions" className="styled-list-item-text" />
          </ListItem>
          <ListItem component={Link} to="products" onClick={toggleDrawer} className="styled-list-item">
            <ListItemIcon>
              <svg
                
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="icon/shopping-bag">
                  <path
                    id="Vector"
                    d="M4 1.33301L2 3.99967V13.333C2 13.6866 2.14048 14.0258 2.39052 14.2758C2.64057 14.5259 2.97971 14.6663 3.33333 14.6663H12.6667C13.0203 14.6663 13.3594 14.5259 13.6095 14.2758C13.8595 14.0258 14 13.6866 14 13.333V3.99967L12 1.33301H4Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_2"
                    d="M2 4H14"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_3"
                    d="M10.6663 6.66699C10.6663 7.37424 10.3854 8.05251 9.88529 8.55261C9.3852 9.05271 8.70692 9.33366 7.99967 9.33366C7.29243 9.33366 6.61415 9.05271 6.11406 8.55261C5.61396 8.05251 5.33301 7.37424 5.33301 6.66699"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </ListItemIcon>
            <ListItemText primary="Products" className="styled-list-item-text" />
          </ListItem>
        </List>
      </div>
      <div className="footerSidebar">
       <span>&copy; 2024</span>
        <span>BudgetBuddy</span>
      </div>
    </Drawer>
  );
};
