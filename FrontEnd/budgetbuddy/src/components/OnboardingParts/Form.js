import React from "react";

export const Form = ({ children, ...props }) => {
  return (
    <form style={{ width: "100%" }} {...props} noValidate>
      {children}
    </form>
  );
};
