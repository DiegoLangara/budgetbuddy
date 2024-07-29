import React from "react";
import styled from "styled-components";

export const Field = ({ children, label }) => {
  const id = getChildId(children);

  return (
    <div className="mb-3">
      <StyledLabel htmlFor={id}>
        {label}
      </StyledLabel>
      {children}
    </div>
  );
};

// Utility to get the `id` prop from child component
const getChildId = (children) => {
  const child = React.Children.only(children);
  return child?.props?.id || "";
};


const StyledLabel = styled.label`
  font-size: 14px;
  margin-bottom: 0.25rem;
`;