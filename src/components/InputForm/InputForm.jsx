import { Input } from "antd";
import React, { useState } from "react";
import "./InputForm.css";
const InputForm = (props) => {
  const { valueInput } = useState("");
  const { placeholder = "Nhập email của bạn", ...rests } = props;
  return (
    <Input
      size="large"
      status="error"
      placeholder={placeholder}
      valueInput={valueInput}
      className="custom-input"
      {...rests}
    />
  );
};

export default InputForm;
