import React, { useState } from "react";
import { Input } from "antd";

const InputFormPassword = (props) => {
  const { valueInput } = useState("");
  const { placeholder = "Nhập Mật khẩu của bạn", ...rests } = props;
  return (
    <Input.Password
      size="large"
      status="error"
      placeholder={placeholder}
      valueInput={valueInput}
      className="custom-input"
      {...rests}
    />
  );
};
export default InputFormPassword;
