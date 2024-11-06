import React, { useState } from "react";
import "./header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faBell,
  faLocationDot,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faUser as faUserRegular } from "@fortawesome/free-regular-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import ToggleDropdown from "./toggleDropdown";
import { useDispatch, useSelector } from "react-redux";
import { Popover } from "antd";
import * as UserService from "../../service/UserService";
import { resetUser } from "../../redux/userSlide";

const HeaderComponent = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await UserService.logoutUser();
    dispatch(resetUser());
    handleNavigateLogin();
  };

  const content = (
    <div className="user-menu">
      <p onClick={() => navigate("/Profile-User")}>Thông tin người dùng</p>
      <p onClick={handleLogout}>Đăng xuất </p>
    </div>
  );

  //Set active tab cho menuTab
  const [setActiveItem] = useState("home");

  const handleTabClick = (item) => {
    setActiveItem(item);
  };

  const navigate = useNavigate();
  const handleNavigateLogin = () => {
    navigate("/SignIn");
  };

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
        <ToggleDropdown />
        <button className="download-btn">Download App</button>
        <ul className="menu-account">
          <li className="left-header">
            <a href="/">
              <span className="icon">
                <FontAwesomeIcon icon={faLocationDot} />
              </span>
            </a>
          </li>

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
                <FontAwesomeIcon icon={faBell} />
              </span>
            </a>
          </li>
          <li className="left-header">
            <a href="/">
              <span className="icon">
                <FontAwesomeIcon icon={faBagShopping} />
              </span>
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default HeaderComponent;
