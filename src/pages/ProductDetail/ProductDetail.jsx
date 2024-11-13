import { Image, Rate } from "antd";
import React, { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { converPrice } from "../../utils";
import "./ProductDetail.css";
import * as FoodService from "../../service/FoodService";
import { useQuery } from "@tanstack/react-query";

const ProductDetail = () => {
  const [numFood, setNumFood] = useState(1);
  const { id } = useParams();
  const onChange = (value) => {
    setNumFood(Number(value));
  };

  // Hàm lấy chi tiết món ăn từ API
  const fetchgetDetailsFood = async (context) => {
    const id = context?.queryKey[1];
    const res = await FoodService.getDetailsFood(id);
    return res.data;
  };

  const { data: foodDetails } = useQuery({
    queryKey: ["food-details", id],
    queryFn: fetchgetDetailsFood,
    enable: !!id,
  });

  const handleChangeCount = (type) => {
    if (type === "increase") {
      setNumFood((prevNumFood) => prevNumFood + 1);
    } else if (type === "decrease" && numFood > 1) {
      setNumFood((prevNumFood) => prevNumFood - 1);
    }
  };

  return (
    <div className="container" id={id}>
      <div className="field-back">
        <NavLink className="btn-back" to="/Product">
          <span>&larr;</span> Quay lại
        </NavLink>
      </div>
      <div className="row">
        <div className="col-md-6 field-img">
          <Image
            style={{
              height: "400px",
              width: "600px",
              objectFit: "cover",
              borderRadius: "20px",
            }}
            src={foodDetails?.HinhAnh}
            preview={false}
            alt="image Product"
          />
        </div>
        <div className="col-md-6">
          <div className="product-header">
            <h1 className="NameProduct">{foodDetails?.TenMonAn}</h1>
          </div>
          {/* <div className="price">{converPrice(foodDetails?.GiaMonAn)}</div> */}

          <span className="price">
            {converPrice(foodDetails?.GiaMonAn)}{" "}
            <span style={{ fontSize: "20px", color: "#999" }}>
              - {converPrice(foodDetails?.GiamGia || 5)}
            </span>
          </span>

          <div>
            <span>
              <Rate allowHalf value={foodDetails?.DanhGia || 0} />
              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "20px",
                }}
              >
                | Đã bán {foodDetails?.DaBan || 1000}
              </span>
            </span>
          </div>
          <div className="description">
            <span
              className="item"
              style={{ display: "flex", textAlign: "justify" }}
            >
              <p>{foodDetails?.MoTa}</p>
            </span>
          </div>
          <div className="quantity">
            <p>Số lượng</p>
          </div>
          <div className="add-items">
            <div className="quantity-controls">
              <button
                className="minus"
                onClick={() => handleChangeCount("decrease")}
              >
                -
              </button>
              <input
                className="number pt-0"
                onChange={onChange}
                value={numFood}
              />
              <button
                className="plus"
                onClick={() => handleChangeCount("increase")}
              >
                +
              </button>
              <button
                type="button"
                className="btn-total"
                style={{ marginLeft: "10px" }}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
