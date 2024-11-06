import { PhoneOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { useDispatch } from "react-redux";
import * as UserService from "../../service/UserService";
import { resetUser } from "../../redux/userSlide";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await UserService.logoutUser();
    dispatch(resetUser());
    handleNavigateLogin();
  };

  const handleNavigateLogin = () => {
    navigate("/SignIn");
  };

  return (
    <div>
      <div className="container pt-5" style={{ marginBottom: "100px" }}>
        <div className="row ">
          <div className="col-3  ">
            <div
              className="card border-0 shadow"
              style={{
                borderRadius: "10px",
                backgroundColor: "#ff5b6a",
                color: "#fff",
              }}
            >
              <div className="text-center p-4">
                <div
                  style={{
                    width: "177px",
                    height: "177px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    color: "#ff5b6a",
                    fontSize: "2rem",
                    lineHeight: "80px",
                    margin: "0 auto",
                  }}
                >
                  H
                </div>
                <p style={{ marginTop: "10px", fontWeight: "500" }}>
                  Nguyễn Trọng Hiếu
                </p>
              </div>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                <li style={{ padding: "10px 20px", fontSize: "1rem" }}>
                  <Link style={{ color: "#fff", textDecoration: "none" }}>
                    <UserOutlined /> Thông tin tài khoản
                  </Link>
                </li>

                <li style={{ padding: "10px 20px", fontSize: "1rem" }}>
                  <Link style={{ color: "#fff", textDecoration: "none" }}>
                    <UserOutlined /> Thông tin đơn hàng
                  </Link>
                </li>

                <li style={{ padding: "10px 20px", fontSize: "1rem" }}>
                  <Link
                    style={{ color: "#fff", textDecoration: "none" }}
                    onClick={handleLogout}
                  >
                    <UserOutlined /> Đăng xuất
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-9 ">
            <div
              className="card border-0 shadow"
              style={{
                borderRadius: "10px",
                padding: "20px",
                background: "#fff",
              }}
            >
              <h2
                style={{
                  fontWeight: "700",
                  fontSize: "1.8rem",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                THÔNG TIN TÀI KHOẢN
              </h2>
              <Form layout="vertical">
                <Form.Item label="Họ tên">
                  <Input
                    type="text"
                    size="large"
                    placeholder="Họ và Tên"
                    prefix={<UserOutlined />}
                  />
                </Form.Item>

                <Form.Item label="Số điện thoại">
                  <Input
                    type="text"
                    size="large"
                    placeholder="Số điện thoại"
                    prefix={<PhoneOutlined />}
                  />
                </Form.Item>
                <Form.Item label="Email">
                  <Input
                    type="text"
                    size="large"
                    placeholder="Email"
                    prefix={<MailOutlined />}
                    disabled
                  />
                </Form.Item>

                <div className="row">
                  <div className="col-md-4">
                    <Form.Item>
                      <Select
                        defaultValue="Chọn tỉnh thành"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item>
                      <Select
                        defaultValue="Chọn quận huyện"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item>
                      <Select
                        defaultValue="Chọn phường xã"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </div>
                </div>

                <Form.Item label="Địa chỉ">
                  <Input type="text" size="large" placeholder="Địa chỉ" />
                </Form.Item>

                <div className="d-flex justify-content-end mt-4">
                  <Button
                    type="primary"
                    size="large"
                    style={{
                      width: "150px",
                      backgroundColor: "#ff5b6a",
                      borderColor: "#ff5b6a",
                      color: "#fff",
                    }}
                  >
                    Cập nhật thông tin
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
