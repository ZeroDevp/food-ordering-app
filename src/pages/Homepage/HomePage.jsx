import React, { useState } from "react";
import "./homePage.css";
import { NavLink } from "react-router-dom";
import { Carousel, Pagination } from "antd";
import CardComponent from "../../components/CardComponent/CardComponent";
import BackToTop from "../../components/BackToTopComponent/BackToTopComponent";

const HomePage = () => {
  const [setActiveItem] = useState("home");

  const handleTabClick = (item) => {
    setActiveItem(item);
  };

  const itemRender = (current, type, originalElement) => {
    if (type === "page") {
      return <div className={`dot ${current === 1 ? "active" : ""}`}></div>;
    }
    return originalElement;
  };

  return (
    <div className="main-content">
      <product />
      <Carousel autoplay>
        <div>
          <img
            width={"100%"}
            src={require("../../assets/banner/banner-web-trung-thu.jpg")}
            alt="banner1"
          />
        </div>
        <div>
          <img
            width={"100%"}
            src={require("../../assets/banner/banner_giamgia.jpg")}
            alt="banner1"
          />
        </div>
      </Carousel>

      <div className="container">
        <div className="menu-bar">
          <div className="swipper">
            <NavLink
              className="menu-item"
              exact
              to="/Product"
              activeClassName="active"
              onClick={() => handleTabClick("product")}
            >
              <img
                src={require("../../assets/icon/icon-dathang.png")}
                alt="ThucDon"
              />
              <span>Thực đơn</span>
            </NavLink>
            <NavLink
              className="menu-item"
              exact
              to="/Blog"
              onClick={() => handleTabClick("blog")}
            >
              <img src={require("../../assets/icon/blog.png")} alt="Blog" />
              <span>Tin Tức</span>
            </NavLink>
            <NavLink
              className="menu-item"
              exact
              to="/Contact"
              onClick={() => handleTabClick("contact")}
            >
              <img
                src={require("../../assets/icon/contactNew.png")}
                alt="Liên hệ"
              />
              <span>Liên Hệ</span>
            </NavLink>
          </div>
        </div>

        <div className="sesion">
          <h2 className="head-title">
            <span>Bán chạy nhất</span>
          </h2>
        </div>

        <div className="row" style={{ marginBottom: "20px" }}>
          <div className="col-md-3">
            <CardComponent />
          </div>
          <div className="col-md-3">
            <CardComponent />
          </div>
          <div className="col-md-3">
            <CardComponent />
          </div>
          <div className="col-md-3">
            <CardComponent />
          </div>
          <div className="pagination">
            <Pagination
              defaultCurrent={2}
              total={50}
              itemRender={itemRender}
              className="custom-pagination"
            />
          </div>
        </div>
      </div>
      <div className="bg-img d-flex align-items-center">
        <div className="container">
          <div className="row d-flex justify-content-center align-items-center text-center">
            <div className="col-lg-8">
              <h3 className="title-h3">Trọng Hiếu FastFood, xin chào</h3>
              <p className="ma-28-semi text-light">
                Chúng tôi là Trọng Hiếu FastFood với hơn 100 cửa hàng trên khắp
                cả nước, chúng tôi mong muốn đem đến niềm vui ẩm thực cho mọi
                gia đình Việt bằng những món ăn chất lượng tốt, hương vị tuyệt
                hảo, dịch vụ chu đáo với một mức giá hợp lý... Hãy đến và thưởng
                thức nhé!
              </p>
              <NavLink
                className="menu-item"
                exact
                to="/Product"
                activeClassName="active"
                onClick={() => handleTabClick("product")}
              >
                <button className="btn-order">Đặt hàng ngay</button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="sesion">
          <h2 className="head-title">
            <span>Tin Tức</span>
          </h2>
        </div>

        <div className="row" style={{ marginBottom: "20px" }}>
          <div className="col-md-3">
            <CardComponent />
          </div>
          <div className="col-md-3">
            <CardComponent />
          </div>
          <div className="col-md-3">
            <CardComponent />
          </div>
          <div className="col-md-3">
            <CardComponent />
          </div>
          <div className="pagination">
            <Pagination
              defaultCurrent={2}
              total={50}
              itemRender={itemRender}
              className="custom-pagination"
            />
          </div>
        </div>
      </div>
      <BackToTop />
    </div>
  );
};

export default HomePage;
