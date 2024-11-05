import { Button } from "antd";
import React from "react";

const ButtonComponent = ({
  size,
  styleButton,
  styleTextButton,
  textButton,
  disable,
  ...rests
}) => {
  return (
    <Button
      style={{
        background: "#ccc",
      }}
      size={size}
      styles={styleButton}
      {...rests}
    >
      <span style={styleTextButton}>{textButton}</span>
    </Button>
  );
};

export default ButtonComponent;
