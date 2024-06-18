import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const TestDashboard = () => {
  return (
    <div style={{ margin: "5rem", textAlign: "center" }}>
      <h1>This is Dashboard!!</h1>
      <StyledLink to="/debts">{"<"} Return</StyledLink>
    </div>
  );
};

const StyledLink = styled(Link)`
  display: inline-block;
  padding: 0.4rem 0.4rem;
  margin: 1rem 0 1.5rem;
  font-weight: bold;
  text-decoration: none;
  background-color: white;
  color: black;
  border: 2px solid black;
  border-radius: 4px;

  &:hover {
    background-color: lightgray;
  }
`;
