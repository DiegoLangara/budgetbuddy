import React from "react";
import styled from "styled-components";

export const Input = React.forwardRef(({ error, ...props }, ref) => {
  return (
    <>
      <StyledInput
        ref={ref}
        className={`form-control ${error ? "is-invalid" : ""}`}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </>
  );
});

const StyledInput = styled.input`
font-size: 11px;
padding: 0.25rem;
`;