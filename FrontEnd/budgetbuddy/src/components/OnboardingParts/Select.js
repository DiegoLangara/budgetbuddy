import React from "react";

export const Select = React.forwardRef((props, ref) => {
  const { placeholder, value, ...rest } = props;
  return (
    <select ref={ref} {...rest} defaultValue="">
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {value.map((val, index) => (
        <option key={index} value={val}>
          {val}
        </option>
      ))}
    </select>
  );
});
