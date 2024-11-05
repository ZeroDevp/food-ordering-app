import { Input } from "antd";
import React from "react";
import "./InputForm.css";

const InputForm = (props) => {
  const { placeholder = "Nhập text", ...rests } = props;
  const handleOnchangeInput = (e) => {
    props.onChange(e.target.value);
  };
  return (
    <Input
      size="large"
      status="error"
      placeholder={placeholder}
      value={props.value}
      className="custom-input"
      {...rests}
      onChange={handleOnchangeInput}
    />
  );
};

export default InputForm;
