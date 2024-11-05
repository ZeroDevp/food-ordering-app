import React from "react";
import { Card, Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./Card.css";
import { NavLink } from "react-router-dom";

const { Title, Text } = Typography;

const CardComponent = () => {
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
        <Title level={4}>TRUNG THU 1</Title>
        <Text>01 Gà rán</Text>
        <br />
        <Text>01 Khoai tây lắc vị phô mai</Text>

        <div className="card-footer">
          <div className="price-info">
            <Title level={3} style={{ color: "#e74c3c" }}>
              79.000 ₫
            </Title>
            <Text delete>95.000 ₫</Text>
          </div>
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            style={{ backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" }}
          />
        </div>
      </Card>
    </NavLink>
  );
};

export default CardComponent;
