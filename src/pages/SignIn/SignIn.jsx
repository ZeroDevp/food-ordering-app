import React from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import BannerLogin from "../../assets/img/TrongHieu-hearder.png";
import "./SignIn.css";
import { Image } from "antd";
import InputFormPassword from "../../components/InputForm/InputFormPassword";
const SignIn = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "left",
      }}
    >
      <WrapperContainerLeft>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Đăng nhập hoặc tạo tài khoản
        </h2>
        <p style={{ fontWeight: 500, fontSize: "16px" }}>Email</p>
        <InputForm placeholder="your_email@gmail.com" />
        <p style={{ marginTop: "10px", fontWeight: 500, fontSize: "16px" }}>
          Mật khẩu
        </p>
        <InputFormPassword placeholder="Mật khẩu" />

        <button type="button" class="btn-login">
          Đăng nhập
        </button>
        <p>
          <WrapperTextLight>Quên mật khẩu?</WrapperTextLight>
        </p>
        <p>
          Chưa có tài khoản?{" "}
          <span>
            <WrapperTextLight>Tạo tài khoản</WrapperTextLight>
          </span>
        </p>
      </WrapperContainerLeft>
      <WrapperContainerRight>
        <Image
          src={BannerLogin}
          preview={false}
          alt="Logo"
          height="203px"
          width="203px"
        />
      </WrapperContainerRight>
    </div>
  );
};

export default SignIn;
