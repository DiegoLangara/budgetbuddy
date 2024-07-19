import React from "react";
import styled from "styled-components";

export const Field = ({ children, label }) => {
  const id = getChildId(children);

  return (
    <StyledWrapper>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      {children}
    </StyledWrapper>
  );
};

// Utility to get the `id` prop from child component
const getChildId = (children) => {
  const child = React.Children.only(children);
  return child?.props?.id || "";
};

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;

  .form-label {
    width: 150px;
    margin-right: 1em;
    text-align: right;
    white-space: nowrap;
  }

  input {
    width: 100%;
    max-width: 300px;
  }
`;