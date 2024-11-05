import React, { useEffect, useState } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import BannerSignUp from "../../assets/img/TrongHieu-hearder.png";
import { Image, Modal, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons"; // Import icon
import InputFormPassword from "../../components/InputForm/InputFormPassword";
import * as UserService from "../../service/UserService";
import { useMutationHooks } from "../../hook/useMutationHook";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const SignUp = ({ toggleAuthMode }) => {
  const [HoTen, setHoTen] = useState("");
  const [Email, setEmail] = useState("");
  const [MatKhau, setmatKhau] = useState("");
  const [XacNhanMatKhau, setXacNhanMatKhau] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // State cho Modal

  const mutation = useMutationHooks((data) => UserService.signUpUser(data));
  const { data } = mutation;

  const navigate = useNavigate();
  const handleNavigateSignIn = () => {
    navigate("/SignIn");
  };

  //Hàm lấy giá trị tên đăng nhập
  const handleOnchangeHoTen = (value) => {
    setHoTen(value);
  };

  //Hàm lấy giá trị Email
  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };

  //Hàm lấy giá trị mật khẩu
  const handleOnchangePassWord = (value) => {
    setmatKhau(value);
  };

  //Hàm lấy giá trị nhập lại mật khẩu
  const handleOnchangeConfirmPassword = (value) => {
    setXacNhanMatKhau(value);
  };

  //Hàm lấy tất cả giá trị phía trên
  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Đăng ký thành công!");
    } catch (error) {
      console.error("Đăng ký thất bại:", error);
    } finally {
      setIsLoading(false);
    }
    mutation.mutate({ HoTen, Email, MatKhau, XacNhanMatKhau });
  };

  useEffect(() => {
    if (data?.status === "OK") {
      setIsModalVisible(true);
    }
  }, [data]);

  const handleOk = () => {
    setIsModalVisible(false); // Đóng Modal
    navigate("/SignIn"); // Quay về giao diện đăng nhập
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
          height: "600px",
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
              onClick={handleNavigateSignIn}
            />
            {/* Tiêu đề nằm giữa */}
            <h2>ĐĂNG KÝ</h2>
          </div>
          <p style={{ fontWeight: 500, fontSize: "16px" }}>Tên đăng nhập</p>
          <InputForm
            placeholder="Họ và tên của bạn"
            value={HoTen}
            onChange={handleOnchangeHoTen}
          />

          <p style={{ marginTop: "10px", fontWeight: 500, fontSize: "16px" }}>
            Email
          </p>
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

          <p style={{ marginTop: "10px", fontWeight: 500, fontSize: "16px" }}>
            Nhập lại Mật khẩu
          </p>
          <InputFormPassword
            placeholder="Nhập lại mật khẩu của bạn"
            value={XacNhanMatKhau}
            onChange={handleOnchangeConfirmPassword}
          />

          {data && data?.status === "ERR" && (
            <span style={{ color: "red" }}>{data?.message}</span>
          )}

          <button
            disabled={
              !HoTen.length ||
              !Email.length ||
              !MatKhau.length ||
              !XacNhanMatKhau.length
            }
            style={{
              backgroundColor:
                !HoTen.length ||
                !Email.length ||
                !MatKhau.length ||
                !XacNhanMatKhau.length
                  ? "#ccc"
                  : "#ff5b6a",
              cursor:
                !HoTen.length ||
                !Email.length ||
                !MatKhau.length ||
                !XacNhanMatKhau.length
                  ? "not-allowed"
                  : "pointer",
            }}
            type="button"
            className="btn-login"
            onClick={handleSignUp}
          >
            {isLoading ? (
              <Spin indicator={<LoadingOutlined spin />} />
            ) : (
              "Đăng ký"
            )}
          </button>

          <p>
            Bạn đã có tài khoản?{" "}
            <span>
              <WrapperTextLight
                onClick={handleNavigateSignIn}
                style={{ cursor: "pointer" }}
              >
                Hãy đăng nhập
              </WrapperTextLight>
            </span>
          </p>
        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image
            src={BannerSignUp}
            preview={false}
            alt="Logo"
            height="203px"
            width="203px"
          />
        </WrapperContainerRight>

        <Modal
          title="Thông báo"
          open={isModalVisible}
          onOk={handleOk}
          cancelButtonProps={{ style: { display: "none" } }}
        >
          <p>Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.</p>
        </Modal>
      </div>
    </div>
  );
};

export default SignUp;
