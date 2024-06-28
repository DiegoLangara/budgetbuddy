import React from "react";

export const Field = ({ children, label, error }) => {
  const id = getChildId(children);

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      {children}
      {error && <small className="text-danger">{error.message}</small>}
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
