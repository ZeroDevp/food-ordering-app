import React, { useState } from "react";
import "./header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faBell,
  faLocationDot,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import ToggleDropdown from "./toggleDropdown";
import { Modal } from "antd";
import SignIn from "../../pages/SignIn/SignIn";

const HeaderComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  // const handleOk = () => {
  //   setIsModalOpen(false);
  // };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  //Set active tab cho menuTab
  const [setActiveItem] = useState("home");

  const handleTabClick = (item) => {
    setActiveItem(item);
  };

  return (
    <header className="header">
      <div className="header-left">
        <NavLink exact to="/">
          <img
            src={require("../../assets/img/TrongHieu-hearder.png")} // Replace this with your logo
            alt="Logo"
            className="logo-header"
          />
        </NavLink>
      </div>
      <nav className="header-center">
        <NavLink
          className="nav-link"
          exact
          to="/"
          activeClassName="active"
          onClick={() => handleTabClick("home")}
        >
          TRANG CHỦ
        </NavLink>
        <NavLink
          className="nav-link"
          exact
          to="/Product"
          activeClassName="active"
          onClick={() => handleTabClick("product")}
        >
          THỰC ĐƠN
        </NavLink>

        <NavLink
          className="nav-link"
          exact
          to="/Blog"
          activeClassName="active"
          onClick={() => handleTabClick("blog")}
        >
          TIN TỨC
        </NavLink>

        <NavLink
          className="nav-link"
          exact
          to="/Contact"
          activeClassName="active"
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
          <li className="left-header" onClick={showModal}>
            <span className="icon" style={{ cursor: "pointer" }}>
              <FontAwesomeIcon icon={faUser} />
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
      <Modal
        title=""
        open={isModalOpen}
        centered={true}
        footer={null}
        width={800}
        height={445}
        onCancel={handleCancel}
        className="modal-content"
      >
        <SignIn />
      </Modal>
    </header>
  );
};

export default HeaderComponent;
