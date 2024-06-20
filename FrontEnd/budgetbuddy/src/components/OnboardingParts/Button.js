import React, { forwardRef } from "react";
import styled from "styled-components";

export const Button = ({ children, ...props }) => {
  return <StyledBtn {...props}>{children}</StyledBtn>;
};

const StyledBtn = styled.button`
  display: inline-block;
  padding: 0.3rem 0.7rem;
  margin: 1rem 0 0.8rem;
  font-weight: bold;
  text-decoration: none;
  background-color: black;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: rgb(100, 100, 100);
  }
`;
