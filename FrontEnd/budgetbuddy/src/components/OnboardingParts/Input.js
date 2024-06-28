import React from "react";

export const Input = React.forwardRef((props, ref) => {
  return <input ref={ref} className="form-control" {...props} />;
});
