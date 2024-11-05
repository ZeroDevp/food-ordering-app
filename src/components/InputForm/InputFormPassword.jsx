import { Input } from "antd";
import React from "react";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "./InputForm.css";

const InputFormPassword = (props) => {
  const { placeholder = "Nhập text", ...rests } = props;

  const handleOnchangeInput = (e) => {
    props.onChange(e.target.value);
  };

  return (
    <Input.Password
      size="large"
      status="error"
      placeholder={placeholder}
      iconRender={(visible) =>
        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
      }
      value={props.value}
      className="custom-input"
      {...rests}
      onChange={handleOnchangeInput}
    />
  );
};

export default InputFormPassword;
