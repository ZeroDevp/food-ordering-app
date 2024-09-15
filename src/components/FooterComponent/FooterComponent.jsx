import React from "react";
import "./footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faSquareInstagram,
  faSquareThreads,
} from "@fortawesome/free-brands-svg-icons";

const FooterComponent = () => {
  return (
    <footer id="footer" className="footer">
      <div className="container">
        <div className="row">
          {/* Logo and Newsletter Section */}
          <div className="col-md-3">
            <div className="footer-logo">
              <img
                src={require("../../assets/img/TrongHieu.png")}
                alt="Logo"
                className="logo"
              />
            </div>
            <h3 className="newsletter-title">
              Đăng ký nhận thông tin khuyến mãi
            </h3>
            <form className="newsletter-form">
              <input type="email" placeholder="Nhập email của bạn" />
              <button type="submit">Gửi ngay</button>
            </form>
          </div>

          {/* Information Links */}
          <div className="col-md-3 footer-section">
            <h4 className="section-1">THÔNG TIN</h4>
            <ul>
              <li>
                <a href="/">Tin tức</a>
              </li>
              <li>
                <a href="/">Khuyến mãi</a>
              </li>
              <li>
                <a href="/">Tuyển dụng</a>
              </li>
              <li>
                <a href="/">Nhượng quyền</a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="col-md-3 footer-section">
            <h4 className="section-2">HỖ TRỢ</h4>
            <ul>
              <li>
                <a href="/">Điều khoản sử dụng</a>
              </li>
              <li>
                <a href="/">Chính sách bảo mật</a>
              </li>
              <li>
                <a href="/">Chính sách giao hàng</a>
              </li>
              <li>
                <a href="/">Chăm Sóc Khách Hàng</a>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="col-md-3 footer-section">
            <h4 className="section-3">THEO DÕI</h4>
            <ul className="social-links">
              <li>
                <FontAwesomeIcon icon={faFacebook} className="Font-icon" />
                <a href="/">Facebook</a>
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faSquareInstagram}
                  className="Font-icon"
                />
                <a href="/">Instagram</a>
              </li>
              <li>
                <FontAwesomeIcon icon={faSquareThreads} className="Font-icon" />
                <a href="/">Thread</a>
              </li>
            </ul>
            <div className="footer-notification">
              <img
                src={require("../../assets/img/boCongThuong.png")}
                alt="Bộ Công Thương"
                style={{ width: "186px", height: "70px" }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="copyright">
        <p style={{ textTransform: "uppercase", paddingTop: "10px" }}>
          &copy; <strong> 2024 Graduation thesis</strong> Site by Trọng Hiếu
        </p>
      </div>
    </footer>
  );
};

export default FooterComponent;
