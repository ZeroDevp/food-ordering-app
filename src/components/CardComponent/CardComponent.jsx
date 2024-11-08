import React from "react";
import { Card, Button, Typography } from "antd";
import { PlusOutlined, StarFilled } from "@ant-design/icons";
import "./Card.css";
import { NavLink } from "react-router-dom";

const { Title } = Typography;

const CardComponent = (props) => {
  const { DaBan, GiaMonAn, GiamGia, TenMonAn, DanhGia, MoTa, HinhAnh } = props;
  //HinhAnh,id, LoaiMonAn
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
            src={HinhAnh}
            alt="trungthu-1"
            style={{
              height: "300px",
              width: "308px",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          />
        }
      >
        <Title level={4} style={{ fontWeight: "bold" }}>
          {TenMonAn}
        </Title>
        {/* <span
          style={{
            fontSize: "14px",
            color: "#000",
            fontStyle: "italic",
            fontWeight: "600",
          }}
        >
          {LoaiMonAn}
        </span> */}

        <div className="card-footer">
          <div className="price-info">
            <span
              style={{ fontSize: "16px", color: "#ccc", fontWeight: "600" }}
            >
              {MoTa}
            </span>
            <span
              style={{
                marginRight: "4px",
                fontSize: "25px",
                color: "#ff5b6a",
                fontWeight: "700",
              }}
            >
              <span>{GiaMonAn}</span>
              <span> - {GiamGia || 5}%</span>
            </span>
            <span
              style={{
                marginRight: "4px",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              <span> {DanhGia}</span>{" "}
              <StarFilled
                style={{ fontSize: "16px", color: "rgb(253,216,54" }}
              />
              <span> | Đã bán {DaBan || 1000}</span>
            </span>
          </div>
          <Button
            size="large"
            type="primary"
            shape="square"
            icon={
              <PlusOutlined style={{ fontWeight: "700", fontSize: "20px" }} />
            }
            style={{
              backgroundColor: "#ff4d4f",
              borderColor: "#ff4d4f",
              marginTop: "50px",
              width: "50px",
              height: "50px",
            }}
          />
        </div>
      </Card>
    </NavLink>
  );
};

export default CardComponent;
