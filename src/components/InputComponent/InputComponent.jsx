import { Input } from "antd";
import React, { forwardRef } from "react";

const InputComponent = forwardRef(
  ({ size, placeholder, bordered, style, ...rests }, ref) => {
    return (
      <Input
        ref={ref}
        size={size}
        placeholder={placeholder}
        variant={bordered}
        // bordered={bordered}
        style={style}
        {...rests}
      />
    );
  }
);

export default InputComponent;
