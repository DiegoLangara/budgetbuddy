import React from "react";
import styled from "styled-components";

export const FieldForTextBox = ({ children }) => {
  const id = getChildId(children);

  return (
    <StyledWrapper>
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
  align-items: center;

  input {
    width: 100%;
  }
`;