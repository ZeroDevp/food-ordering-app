import React, { useCallback, useEffect, useState } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import BannerLogin from "../../assets/img/TrongHieu-hearder.png";
import "./SignIn.css";
import { Image, Spin } from "antd";
import InputFormPassword from "../../components/InputForm/InputFormPassword";
import * as UserService from "../../service/UserService";
import { useMutationHooks } from "../../hook/useMutationHook";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/userSlide";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons"; // Import icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SignIn = ({ toggleAuthMode, closeModal }) => {
  const [Email, setEmail] = useState("");
  const [MatKhau, setMatKhau] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigateSignUp = () => {
    navigate("/SignUp");
  };

  const handleNavigateHomePage = () => {
    navigate("/");
  };
  // Hàm mutation dùng để gọi API đăng nhập
  const mutation = useMutationHooks((data) => UserService.loginUser(data));
  const { data, isSuccess } = mutation;

  const handleGetDetailsUser = useCallback(
    async (id, token) => {
      if (!token) return;
      try {
        const res = await UserService.getDetailUser(id, token);
        dispatch(updateUser({ ...res?.data, access_token: token }));
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết người dùng:", error);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (isSuccess && data?.access_token) {
      try {
        const decoded = jwtDecode(data.access_token);
        if (decoded?.id) {
          handleGetDetailsUser(decoded.id, data.access_token);
        }
        navigate("/");
        localStorage.setItem("access_token", JSON.stringify(data.access_token));
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
      }
    }
  }, [isSuccess, data, handleGetDetailsUser, navigate]);

  // Hàm lấy giá trị Email
  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };

  // Hàm lấy giá trị mật khẩu
  const handleOnchangePassWord = (value) => {
    setMatKhau(value);
  };

  // Hàm xử lý đăng nhập
  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Đăng nhập thành công!");
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
    } finally {
      setIsLoading(false);
    }
    mutation.mutate({
      Email,
      MatKhau,
    });
    console.log("SignIn: ", Email, MatKhau);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ccc",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "800px",
          height: "445px",
          borderRadius: "6px",
          background: "#fff",
          display: "flex",
        }}
      >
        <WrapperContainerLeft>
          {/* Chèn icon ngay trên tiêu đề */}
          <div
            style={{
              position: "relative",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            {/* Icon nằm bên trái */}
            <FontAwesomeIcon
              icon={faAngleLeft}
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "25px",
                cursor: "pointer",
              }}
              onClick={handleNavigateHomePage}
            />
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              ĐĂNG NHẬP
            </h2>
          </div>
          <p style={{ fontWeight: 500, fontSize: "16px" }}>Email</p>
          <InputForm
            placeholder="your_email@gmail.com"
            value={Email}
            onChange={handleOnchangeEmail}
          />

          <p style={{ marginTop: "10px", fontWeight: 500, fontSize: "16px" }}>
            Mật khẩu
          </p>
          <InputFormPassword
            placeholder="Mật khẩu của bạn"
            value={MatKhau}
            onChange={handleOnchangePassWord}
          />

          {/* Hiển thị lỗi */}
          {data?.status === "ERR" && (
            <span style={{ color: "red" }}>{data?.message}</span>
          )}

          <button
            disabled={!Email.length || !MatKhau.length || isLoading}
            style={{
              backgroundColor:
                !Email.length || !MatKhau.length ? "#ccc" : "#ff5b6a",
              cursor:
                !Email.length || !MatKhau.length || isLoading
                  ? "not-allowed"
                  : "pointer",
            }}
            type="button"
            className="btn-login"
            onClick={handleSignIn}
          >
            {isLoading ? (
              <Spin indicator={<LoadingOutlined spin />} />
            ) : (
              "Đăng nhập"
            )}
          </button>

          <p>
            <WrapperTextLight style={{ cursor: "pointer" }}>
              Quên mật khẩu?
            </WrapperTextLight>
          </p>
          <p>
            Bạn chưa có tài khoản?{" "}
            <span>
              <WrapperTextLight
                onClick={handleNavigateSignUp}
                style={{ cursor: "pointer" }}
              >
                Hãy tạo tài khoản
              </WrapperTextLight>
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
    </div>
  );
};

export default SignIn;
