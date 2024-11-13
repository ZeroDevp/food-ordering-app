import React, { useEffect, useState } from "react";
import "./header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faBell,
  // faLocationDot,
  faUser,
  faUserGear,
} from "@fortawesome/free-solid-svg-icons";
import { faUser as faUserRegular } from "@fortawesome/free-regular-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
// import ToggleDropdown from "./toggleDropdown";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Popover } from "antd";
import * as UserService from "../../service/UserService";
import { resetUser } from "../../redux/userSlide";
import InputComponent from "../../components/InputComponent/InputComponent";

import {
  LogoutOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import customImage from "../../assets/img/logout.png";
import { searchFood } from "../../redux/slide/foodSlide";

const HeaderComponent = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const showLogoutModal = () => {
    setIsLogoutModalVisible(true);
  };

  const handleLogout = async () => {
    await UserService.logoutUser();
    dispatch(resetUser());
    handleNavigateLogin();
  };

  const handleCancelLogout = () => {
    setIsLogoutModalVisible(false);
  };

  const confirmLogout = () => {
    handleLogout();
    setIsLogoutModalVisible(false);
  };

  const content = (
    <div className="user-menu">
      <p onClick={() => navigate("/Profile-User")}>
        {" "}
        <UserOutlined /> Thông tin người dùng
      </p>
      {user?.isAdmin && (
        <p onClick={() => navigate("/system/Admin")}>
          {" "}
          <FontAwesomeIcon icon={faUserGear} /> Quản lý hệ thống{" "}
        </p>
      )}
      <p onClick={showLogoutModal}>
        {" "}
        <LogoutOutlined /> Đăng xuất{" "}
      </p>
    </div>
  );

  //Set active tab cho menuTab
  const [setActiveItem] = useState("home");

  const handleTabClick = (item) => {
    setActiveItem(item);
  };

  const handleNavigateLogin = () => {
    navigate("/SignIn");
  };

  const onSearch = (e) => {
    setSearch(e.target.value);
    dispatch(searchFood(e.target.value));
  };

  useEffect(() => {
    console.log("object", search);
  }, [search]);

  return (
    <header className="header">
      <div className="header-left">
        <NavLink to="/">
          <img
            src={require("../../assets/img/TrongHieu-hearder.png")} // Replace this with your logo
            alt="Logo"
            className="logo-header"
          />
        </NavLink>
      </div>
      <nav className="header-center">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={() => handleTabClick("home")}
        >
          TRANG CHỦ
        </NavLink>
        <NavLink
          to="/Product"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={() => handleTabClick("product")}
        >
          THỰC ĐƠN
        </NavLink>
        <NavLink
          to="/Blog"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={() => handleTabClick("blog")}
        >
          TIN TỨC
        </NavLink>
        <NavLink
          to="/Contact"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={() => handleTabClick("contact")}
        >
          LIÊN HỆ
        </NavLink>
      </nav>
      <div className="right-content">
        <InputComponent
          style={{ width: "500px", border: "1px solid #ccc" }}
          size="large"
          placeholder="Tìm kiếm..."
          prefix={<SearchOutlined />}
          onChange={onSearch}
        />
        {/* <ToggleDropdown />
        <button className="download-btn">Download App</button> */}
        <ul className="menu-account">
          {/* <li className="left-header">
            <a href="/">
              <span className="icon">
                <FontAwesomeIcon icon={faLocationDot} />
              </span>
            </a>
          </li> */}

          <li className="left-header">
            <span className="icon" style={{ cursor: "pointer" }}>
              {user?.HoTen ? (
                <>
                  <Popover placement="bottom" content={content}>
                    <FontAwesomeIcon icon={faUser} />
                  </Popover>
                </>
              ) : (
                <FontAwesomeIcon
                  icon={faUserRegular}
                  onClick={handleNavigateLogin}
                />
              )}
            </span>
          </li>
          <li className="left-header">
            <a href="/">
              <span className="icon">
                <FontAwesomeIcon icon={faBagShopping} />
              </span>
            </a>
          </li>
          <li className="left-header">
            <a href="/">
              <span className="icon">
                <FontAwesomeIcon icon={faBell} />
              </span>
            </a>
          </li>
        </ul>
      </div>
      <Modal
        open={isLogoutModalVisible}
        onOk={confirmLogout}
        onCancel={handleCancelLogout}
        footer={null}
        centered
        style={{
          padding: "20px",
          textAlign: "center",
          borderRadius: "10px",
        }}
        wrapClassName="custom-logout-modal"
      >
        <img
          src={customImage}
          alt="Custom Icon"
          style={{ width: "400px", marginBottom: "0px" }}
        />

        {/* Container for the text and buttons */}
        <div style={{ marginTop: "20px" }}>
          <p style={{ fontSize: "18px", marginBottom: "20px" }}>
            Bạn muốn đăng xuất?
          </p>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <Button
              onClick={handleCancelLogout}
              style={{
                backgroundColor: "#f2f2f2",
                borderColor: "#f2f2f2",
                color: "#ff6666",
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleLogout}
              style={{
                backgroundColor: "#ff6666",
                borderColor: "#ff6666",
                color: "#fff",
              }}
            >
              OK
            </Button>
          </div>
        </div>
      </Modal>
    </header>
  );
};

export default HeaderComponent;
