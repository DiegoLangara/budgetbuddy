import React from "react";
import { Route, Routes, Navigate, Link } from "react-router-dom";
import { GoalsBM } from "../components/BudgetManagement/GoalsBM";
import { IncomesBM } from "../components/BudgetManagement/IncomesBM";
import { BudgetsBM } from "../components/BudgetManagement/BudgetsBM";
import { DebtsBM } from "../components/BudgetManagement/DebtsBM";
import { useTheme, useMediaQuery } from "@mui/material";
import styled from "styled-components";
import "../css/BudgetPage.css";

const Container = styled.div`
  width: 97%;
  padding: ${(props) =>
    props.isMobile ? "1vh" : "1vh 9vw 3vh calc(10vw + 63px)"};
  margin: 0 auto;
`;

const ShrinkedNav = styled.nav`
  ul {
    list-style: none !important;
    text-decoration: none !important;
    padding: 0;
    display: flex;
    flex-direction: ${(props) => (props.isMobile ? "column" : "row")};
    gap: ${(props) => (props.isMobile ? "0.5rem" : "0")};
  }

  .list-group-item {
    border: none !important;
    border-radius: 1rem !important;
  }
`;

const Aside = styled.aside`
  width: ${(props) => (props.isMobile ? "100%" : "15vw")};
  padding: ${(props) => (props.isMobile ? "0" : "0 1.5rem 0 0")};
  margin-bottom: ${(props) => (props.isMobile ? "1rem" : "0")};

  nav ul {
    list-style: none !important;
    text-decoration: none !important;
    padding: 0;
  }
  nav ul li {
    margin-bottom: ${(props) => (props.isMobile ? "0.5rem" : "0")} !important;
    margin-bottom: 1rem !important;
  }

  .list-group-item {
    margin-bottom: ${(props) => (props.isMobile ? "0.5rem" : "0")};
  }
`;

const StyledLink = styled(Link)`
  flex: 1;
  width: 100%;
  position: relative;
  font-size: ${(props) => (props.isMobile ? "4vw" : "0.8vw")};
  letter-spacing: 0.02em;
  line-height: ${(props) => (props.isMobile ? "6vw" : "28px")};
  display: inline-block;
  font-family: 'DM Sans';
  color: #334155;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;

  list-style: none !important;
  text-decoration: none !important;
    
  svg {
    margin: 0 8px;
  }
`;

const NavItem = ({ to, children, iconBefore, iconAfter }) => (
  <li className="list-group-item">
    <StyledLink to={to} isMobile={useMediaQuery('(max-width:600px)')}>
      {iconBefore}
      {children}
      {iconAfter}
    </StyledLink>
  </li>
);

export const BudgetPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container isMobile={isMobile}>
      {isMobile && (
        <ShrinkedNav isMobile={isMobile}>
          <ul className="list-group">
            <NavItem 
              to="goals-bm" 
              iconBefore={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="goal" clipPath="url(#clip0_3880_4785)">
                    <path id="Icon" d="M10.6663 5.33301V3.33301L12.6663 1.33301L13.333 2.66634L14.6663 3.33301L12.6663 5.33301H10.6663ZM10.6663 5.33301L7.99965 7.99964M14.6663 7.99967C14.6663 11.6816 11.6816 14.6663 7.99967 14.6663M1.33301 7.99967C1.33301 4.31778 4.31778 1.33301 7.99967 1.33301" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path id="Icon_2" d="M11.3337 8.00033C11.3337 9.84127 9.84127 11.3337 8.00033 11.3337C6.15938 11.3337 4.66699 9.84127 4.66699 8.00033C4.66699 6.15938 6.15938 4.66699 8.00033 4.66699" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_3880_4785">
                      <rect width="16" height="16" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              }
              iconAfter={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="secondary icon">
                  <path id="Vector" d="M6 12L10 8L6 4" stroke="#334155" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
              </svg>
              }
            >
              Financial Goals
            </NavItem>
            <NavItem 
              to="incomes-bm" 
              iconBefore={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="income">
                    <path id="Icon" d="M3.99967 7.33366V10.0003M11.9997 6.00032V8.66699M11.333 2.66699C12.9655 2.66699 13.8484 2.91683 14.2878 3.11062C14.3463 3.13643 14.3755 3.14933 14.4599 3.22991C14.5106 3.2782 14.6029 3.41992 14.6267 3.48572C14.6663 3.59548 14.6663 3.65549 14.6663 3.77549V10.9411C14.6663 11.5469 14.6663 11.8499 14.5755 12.0056C14.4831 12.1639 14.3939 12.2376 14.221 12.2984C14.0509 12.3583 13.7077 12.2923 13.0211 12.1604C12.5406 12.0681 11.9707 12.0003 11.333 12.0003C9.33301 12.0003 7.33301 13.3337 4.66634 13.3337C3.03387 13.3337 2.15092 13.0838 1.7116 12.89C1.65309 12.8642 1.62384 12.8513 1.53941 12.7707C1.4888 12.7224 1.39642 12.5807 1.37265 12.5149C1.33301 12.4052 1.33301 12.3452 1.33301 12.2252L1.33301 5.05956C1.33301 4.45372 1.33301 4.15079 1.42386 3.99509C1.51628 3.8367 1.6054 3.76307 1.77838 3.7022C1.94843 3.64236 2.2917 3.70831 2.97823 3.84022C3.45875 3.93255 4.02866 4.00032 4.66634 4.00032C6.66634 4.00032 8.66634 2.66699 11.333 2.66699ZM9.66634 8.00032C9.66634 8.9208 8.92015 9.66699 7.99967 9.66699C7.0792 9.66699 6.33301 8.9208 6.33301 8.00032C6.33301 7.07985 7.0792 6.33366 7.99967 6.33366C8.92015 6.33366 9.66634 7.07985 9.66634 8.00032Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                </svg>
              }
              iconAfter={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="secondary icon">
                    <path id="Vector" d="M6 12L10 8L6 4" stroke="#334155" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                </svg>
              }
            >
              Income
            </NavItem>
            <NavItem 
              to="budgets-bm" 
              iconBefore={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="budget">
                    <path id="Icon" d="M14.6667 5.66699H1.33334M1.33334 8.33366H3.69779C4.05792 8.33366 4.23799 8.33366 4.4121 8.3647C4.56665 8.39224 4.71741 8.43789 4.86128 8.5007C5.02337 8.57145 5.17319 8.67134 5.47284 8.8711L5.86052 9.12955C6.16016 9.32932 6.30998 9.4292 6.47207 9.49995C6.61594 9.56276 6.76671 9.60841 6.92125 9.63596C7.09537 9.66699 7.27543 9.66699 7.63556 9.66699H8.36446C8.72459 9.66699 8.90465 9.66699 9.07877 9.63596C9.23331 9.60841 9.38408 9.56276 9.52795 9.49995C9.69004 9.4292 9.83986 9.32932 10.1395 9.12955L10.5272 8.8711C10.8268 8.67134 10.9767 8.57145 11.1387 8.5007C11.2826 8.43789 11.4334 8.39224 11.5879 8.3647C11.762 8.33366 11.9421 8.33366 12.3022 8.33366H14.6667M1.33334 4.80033L1.33334 11.2003C1.33334 11.9471 1.33334 12.3204 1.47867 12.6056C1.6065 12.8565 1.81047 13.0605 2.06136 13.1883C2.34657 13.3337 2.71994 13.3337 3.46668 13.3337L12.5333 13.3337C13.2801 13.3337 13.6534 13.3337 13.9387 13.1883C14.1895 13.0605 14.3935 12.8565 14.5214 12.6056C14.6667 12.3204 14.6667 11.9471 14.6667 11.2003V4.80033C14.6667 4.05359 14.6667 3.68022 14.5214 3.39501C14.3935 3.14412 14.1895 2.94015 13.9387 2.81232C13.6534 2.66699 13.2801 2.66699 12.5333 2.66699L3.46668 2.66699C2.71994 2.66699 2.34657 2.66699 2.06136 2.81232C1.81047 2.94015 1.6065 3.14412 1.47867 3.395C1.33334 3.68022 1.33334 4.05359 1.33334 4.80033Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                </svg>
              }
              iconAfter={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="secondary icon">
                    <path id="Vector" d="M6 12L10 8L6 4" stroke="#334155" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                </svg>
              }
            >
              Budget
            </NavItem>
            <NavItem 
              to="debts-bm"
              iconBefore={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="icon/shopping-bag">
                  <path id="Vector" d="M4 1.33301L2 3.99967V13.333C2 13.6866 2.14048 14.0258 2.39052 14.2758C2.64057 14.5259 2.97971 14.6663 3.33333 14.6663H12.6667C13.0203 14.6663 13.3594 14.5259 13.6095 14.2758C13.8595 14.0258 14 13.6866 14 13.333V3.99967L12 1.33301H4Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path id="Vector_2" d="M2 4H14" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path id="Vector_3" d="M10.6663 6.66699C10.6663 7.37424 10.3854 8.05251 9.88529 8.55261C9.3852 9.05271 8.70692 9.33366 7.99967 9.33366C7.29243 9.33366 6.61415 9.05271 6.11406 8.55261C5.61396 8.05251 5.33301 7.37424 5.33301 6.66699" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
              </svg>                    
              }
              iconAfter={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="secondary icon">
                  <path id="Vector" d="M6 12L10 8L6 4" stroke="#334155" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
              </svg>
              }
            >
              Debts
            </NavItem>
          </ul>
        </ShrinkedNav>
      )}

      <div
        style={{
          width: "100%",
          display: "flex",
          flex: "1",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {!isMobile && (
          <Aside isMobile={isMobile}>
            <nav>
              <ul className="list-group">
                <NavItem 
                  to="goals-bm" 
                  iconBefore={
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="goal" clipPath="url(#clip0_3880_4785)">
                        <path id="Icon" d="M10.6663 5.33301V3.33301L12.6663 1.33301L13.333 2.66634L14.6663 3.33301L12.6663 5.33301H10.6663ZM10.6663 5.33301L7.99965 7.99964M14.6663 7.99967C14.6663 11.6816 11.6816 14.6663 7.99967 14.6663M1.33301 7.99967C1.33301 4.31778 4.31778 1.33301 7.99967 1.33301" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path id="Icon_2" d="M11.3337 8.00033C11.3337 9.84127 9.84127 11.3337 8.00033 11.3337C6.15938 11.3337 4.66699 9.84127 4.66699 8.00033C4.66699 6.15938 6.15938 4.66699 8.00033 4.66699" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_3880_4785">
                          <rect width="16" height="16" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>
                  }
                  iconAfter={
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="secondary icon">
                    <path id="Vector" d="M6 12L10 8L6 4" stroke="#334155" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    </svg>
                  }
                >
                  Financial Goals
                </NavItem>
                <NavItem 
                  to="incomes-bm" 
                  iconBefore={
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="income">
                        <path id="Icon" d="M3.99967 7.33366V10.0003M11.9997 6.00032V8.66699M11.333 2.66699C12.9655 2.66699 13.8484 2.91683 14.2878 3.11062C14.3463 3.13643 14.3755 3.14933 14.4599 3.22991C14.5106 3.2782 14.6029 3.41992 14.6267 3.48572C14.6663 3.59548 14.6663 3.65549 14.6663 3.77549V10.9411C14.6663 11.5469 14.6663 11.8499 14.5755 12.0056C14.4831 12.1639 14.3939 12.2376 14.221 12.2984C14.0509 12.3583 13.7077 12.2923 13.0211 12.1604C12.5406 12.0681 11.9707 12.0003 11.333 12.0003C9.33301 12.0003 7.33301 13.3337 4.66634 13.3337C3.03387 13.3337 2.15092 13.0838 1.7116 12.89C1.65309 12.8642 1.62384 12.8513 1.53941 12.7707C1.4888 12.7224 1.39642 12.5807 1.37265 12.5149C1.33301 12.4052 1.33301 12.3452 1.33301 12.2252L1.33301 5.05956C1.33301 4.45372 1.33301 4.15079 1.42386 3.99509C1.51628 3.8367 1.6054 3.76307 1.77838 3.7022C1.94843 3.64236 2.2917 3.70831 2.97823 3.84022C3.45875 3.93255 4.02866 4.00032 4.66634 4.00032C6.66634 4.00032 8.66634 2.66699 11.333 2.66699ZM9.66634 8.00032C9.66634 8.9208 8.92015 9.66699 7.99967 9.66699C7.0792 9.66699 6.33301 8.9208 6.33301 8.00032C6.33301 7.07985 7.0792 6.33366 7.99967 6.33366C8.92015 6.33366 9.66634 7.07985 9.66634 8.00032Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </g>
                    </svg>
                  }
                  iconAfter={
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="secondary icon">
                    <path id="Vector" d="M6 12L10 8L6 4" stroke="#334155" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    </svg>
                  }
                >
                  Income
                </NavItem>
                <NavItem 
                  to="budgets-bm" 
                  iconBefore={
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="budget">
                        <path id="Icon" d="M14.6667 5.66699H1.33334M1.33334 8.33366H3.69779C4.05792 8.33366 4.23799 8.33366 4.4121 8.3647C4.56665 8.39224 4.71741 8.43789 4.86128 8.5007C5.02337 8.57145 5.17319 8.67134 5.47284 8.8711L5.86052 9.12955C6.16016 9.32932 6.30998 9.4292 6.47207 9.49995C6.61594 9.56276 6.76671 9.60841 6.92125 9.63596C7.09537 9.66699 7.27543 9.66699 7.63556 9.66699H8.36446C8.72459 9.66699 8.90465 9.66699 9.07877 9.63596C9.23331 9.60841 9.38408 9.56276 9.52795 9.49995C9.69004 9.4292 9.83986 9.32932 10.1395 9.12955L10.5272 8.8711C10.8268 8.67134 10.9767 8.57145 11.1387 8.5007C11.2826 8.43789 11.4334 8.39224 11.5879 8.3647C11.762 8.33366 11.9421 8.33366 12.3022 8.33366H14.6667M1.33334 4.80033L1.33334 11.2003C1.33334 11.9471 1.33334 12.3204 1.47867 12.6056C1.6065 12.8565 1.81047 13.0605 2.06136 13.1883C2.34657 13.3337 2.71994 13.3337 3.46668 13.3337L12.5333 13.3337C13.2801 13.3337 13.6534 13.3337 13.9387 13.1883C14.1895 13.0605 14.3935 12.8565 14.5214 12.6056C14.6667 12.3204 14.6667 11.9471 14.6667 11.2003V4.80033C14.6667 4.05359 14.6667 3.68022 14.5214 3.39501C14.3935 3.14412 14.1895 2.94015 13.9387 2.81232C13.6534 2.66699 13.2801 2.66699 12.5333 2.66699L3.46668 2.66699C2.71994 2.66699 2.34657 2.66699 2.06136 2.81232C1.81047 2.94015 1.6065 3.14412 1.47867 3.395C1.33334 3.68022 1.33334 4.05359 1.33334 4.80033Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </g>
                    </svg>
                  }
                  iconAfter={
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="secondary icon">
                    <path id="Vector" d="M6 12L10 8L6 4" stroke="#334155" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    </svg>
                  }
                >
                  Budget
                </NavItem>
                <NavItem 
                  to="debts-bm"
                  iconBefore={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="icon/shopping-bag">
                    <path id="Vector" d="M4 1.33301L2 3.99967V13.333C2 13.6866 2.14048 14.0258 2.39052 14.2758C2.64057 14.5259 2.97971 14.6663 3.33333 14.6663H12.6667C13.0203 14.6663 13.3594 14.5259 13.6095 14.2758C13.8595 14.0258 14 13.6866 14 13.333V3.99967L12 1.33301H4Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path id="Vector_2" d="M2 4H14" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path id="Vector_3" d="M10.6663 6.66699C10.6663 7.37424 10.3854 8.05251 9.88529 8.55261C9.3852 9.05271 8.70692 9.33366 7.99967 9.33366C7.29243 9.33366 6.61415 9.05271 6.11406 8.55261C5.61396 8.05251 5.33301 7.37424 5.33301 6.66699" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    </svg>                    
                    }
                  iconAfter={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="secondary icon">
                    <path id="Vector" d="M6 12L10 8L6 4" stroke="#334155" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    </svg>
                    }
                >
                  Debts
                </NavItem>
              </ul>
            </nav>
          </Aside>
        )}
        <main style={{ 
          flexBasis: "100%",
        }}>
          <Routes>
            <Route path="goals-bm" element={<GoalsBM />}/>
            <Route path="incomes-bm" element={<IncomesBM />}/>
            <Route path="budgets-bm" element={<BudgetsBM />} />
            <Route path="debts-bm" element={<DebtsBM />} />
            {/* Redirect to GoalsBM as the default page */}
            <Route path="*" element={<Navigate to="goals-bm" replace />} />
          </Routes>
        </main>
      </div>
    </Container>
  );
};

export default BudgetPage;
