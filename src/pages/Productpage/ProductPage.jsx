import React from "react";
import { Pagination } from "antd";
import CardComponent from "../../components/CardComponent/CardComponent";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import BackToTop from "../../components/BackToTopComponent/BackToTopComponent";
import "./Product.css";

const ProductPage = () => {
  const itemRender = (current, type, originalElement) => {
    if (type === "page") {
      return <div className={`dot ${current === 1 ? "active" : ""}`}></div>;
    }
    return originalElement;
  };
  return (
    <>
      <div className="container">
        <NavbarComponent />
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
      <BackToTop />
    </>
  );
};

export default ProductPage;
