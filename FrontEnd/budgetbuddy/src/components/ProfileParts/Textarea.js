import React from "react";

export const Textarea = React.forwardRef(({ error, ...props }, ref) => {
  return (
    <>
      <textarea
        ref={ref}
        className={`form-control ${error ? "is-invalid" : ""}`}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </>
  );
});
