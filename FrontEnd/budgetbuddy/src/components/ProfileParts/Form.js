import React from "react";

export const Form = ({ children, ...props }) => {
  return (
    <form className="w-100" {...props} noValidate>
      {children}
    </form>
  );
};
