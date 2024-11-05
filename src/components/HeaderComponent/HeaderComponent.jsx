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
import { useSelector } from "react-redux";

const HeaderComponent = () => {
  const user = useSelector((state) => state.user);

  console.log("user", user);

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
                // <div>{user.HoTen}</div>
                <FontAwesomeIcon icon={faUser} />
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
