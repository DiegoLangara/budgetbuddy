import React from "react";
import styled from "styled-components";

export const Field = ({ children, label, error }) => {
  const id = getChildId(children);
  // console.log(children);

  return (
    <div>
      <label htmlFor={id} style={{ margin: "0.4rem 0", display: "flex" }}>
        {label}
      </label>
      {children}
      {error && <styledSmall>{error.message}</styledSmall>}
    </div>
  );
};

// get id prop from a child element
export const getChildId = (children) => {
  const child = React.Children.only(children);
  if ("id" in child?.props) {
    return child.props.id;
  }
};

const styledSmall = styled.small`
  display: flex;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
`;
