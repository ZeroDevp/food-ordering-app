import { Image } from "antd";
import React from "react";
import { NavLink } from "react-router-dom";
import imgProduct from "../../assets/img/chicken.png";
import "./ProductDetail.css";
// import CardComponent from "../../components/CardComponent/CardComponent";

const ProductDetail = () => {
  // const itemRender = (current, type, originalElement) => {
  //   if (type === "page") {
  //     return <div className={`dot ${current === 1 ? "active" : ""}`}></div>;
  //   }
  //   return originalElement;
  // };

  return (
    <div className="container">
      <div className="row">
        <div className="field-back">
          <NavLink className="btn-back" to="/Product">
            <span>&larr;</span> Quay lại
          </NavLink>
        </div>
        <div className="col-md-8 fied-img">
          <Image src={imgProduct} preview={false} alt="image Product" />
        </div>
        <div className="col-md-4">
          <div className="product-header">
            <div className="NameProduct">Lody Set</div>
            <div className="price">145.000 ₫</div>
          </div>
          <div className="description">
            <span className="include">
              <p>Món ăn bao gồm:</p>
            </span>
            <span className="item">
              <p>02 Gà rán</p>
              <p>01 Mì ý </p>
              <p>01 Phô mai que</p>
              <p>02 Pepsi (M)</p>
            </span>
          </div>
          <span className="quantity">
            <p>Số lượng</p>
          </span>
          <div className="add-items">
            <div>
              <button className="plus">+</button>
              <input maxLength="2" className="number pt-0" defaultValue="2" />
              <button className="minus">-</button>
            </div>
            <div>
              <button type="button" className="btn-total">
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="row">
        <span className="more">CÁC MÓN ĂN KHÁC</span>
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
      </div> */}
    </div>
  );
};

export default ProductDetail;
