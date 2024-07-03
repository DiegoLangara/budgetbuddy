import React from "react";

export const Input = React.forwardRef(({ error, ...props }, ref) => {
  return (
    <>
      <input
        ref={ref}
        className={`form-control ${error ? "is-invalid" : ""}`}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </>
  );
});
