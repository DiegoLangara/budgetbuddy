import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

export const Progress = () => {
  const location = useLocation();
  // console.log(location);
  // console.log(location.pathname);

  return (
    <StyledNav>
      <StyledOl>
        <StyledLi>
          <StyledProgressLink
            to="personal-details"
            active={location.pathname === "personal-details"}
          >
            Personal
          </StyledProgressLink>
        </StyledLi>
        <StyledLi>
          <StyledProgressLink to="goals" active={location.pathname === "goals"}>
            Goals
          </StyledProgressLink>
        </StyledLi>
        <StyledLi>
          <StyledProgressLink
            to="incomes"
            active={location.pathname === "incomes"}
          >
            Incomes
          </StyledProgressLink>
        </StyledLi>
        <StyledLi>
          <StyledProgressLink
            to="budget"
            active={location.pathname === "budget"}
          >
            Budget
          </StyledProgressLink>
        </StyledLi>
        <StyledLi>
          <StyledProgressLink to="debts" active={location.pathname === "debts"}>
            Debts
          </StyledProgressLink>
        </StyledLi>
      </StyledOl>
    </StyledNav>
  );
};

const StyledNav = styled.nav`
  display: flex;
  padding: 20px;
  margin-top: 1rem;
`;

const StyledOl = styled.ol`
  margin: 0 0 0 1.5rem;
  padding: 0;
  list-style-type: none;
  display: grid;
  grid-template-columns: repeat(5, 140px);
  justify-content: space-between;
`;

const StyledLi = styled.li`
  justify-self: center;
`;

const StyledProgressLink = styled(Link)`
  text-decoration: none;
  color: ${(props) => (props.active ? "white" : "black")};
  background-color: ${(props) => (props.active ? "rgb(4, 105, 138)" : null)};
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  position: relative;
  padding: 0.5rem;
  text-align: center;
`;
