import React from "react";

export const Field = ({ children, label }) => {
  const id = getChildId(children);

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      {children}
    </div>
  );
};

// Utility to get the `id` prop from child component
const getChildId = (children) => {
  const child = React.Children.only(children);
  return child?.props?.id || "";
};
