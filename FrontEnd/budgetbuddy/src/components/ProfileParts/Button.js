import React from "react";

export const Button = ({ children, ...props }) => {
  return (
    <button className="btn btn-primary btn-hover" {...props}>
      {children}
    </button>
  );
};
