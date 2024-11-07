import React from "react";
import { Card, Button, Typography } from "antd";
import { PlusOutlined, StarFilled } from "@ant-design/icons";
import "./Card.css";
import { NavLink } from "react-router-dom";

const { Title } = Typography;

const CardComponent = (props) => {
  const { DaBan, GiaMonAn, GiamGia, TenMonAn, DanhGia, MoTa } = props;
  //HinhAnh,id
  return (
    <NavLink to="/Product/ProductDetail" style={{ textDecoration: "none" }}>
      <Card
        hoverable
        style={{
          width: "22rem",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
        cover={
          <img
            src={require("../../assets/img/trungthu-1.jpg")}
            alt="trungthu-1"
            style={{
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          />
        }
      >
        <Title level={4}>{TenMonAn}</Title>
        <span style={{ fontSize: "16px", color: "#ccc" }}>{MoTa}</span>

        <div className="card-footer">
          <div className="price-info">
            <span
              style={{
                marginRight: "4px",
                fontSize: "25px",
                color: "#ff5b6a",
                fontWeight: "700",
              }}
            >
              {GiaMonAn}
            </span>
            <span
              style={{ color: "#ccc", marginRight: "4px", fontSize: "20px" }}
            >
              {GiamGia || 5} %
            </span>
            <span style={{ marginRight: "4px" }}>
              <span>{DanhGia}</span>{" "}
              <StarFilled
                style={{ fontSize: "16px", color: "rgb(253,216,54" }}
              />
              <span> | Đã bán {DaBan || 1000}</span>
            </span>
          </div>
          <Button
            type="primary"
            shape="square"
            icon={<PlusOutlined />}
            style={{ backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" }}
          />
        </div>
      </Card>
    </NavLink>
  );
};

export default CardComponent;
