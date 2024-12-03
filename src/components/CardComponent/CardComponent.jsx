import React, { useState } from "react";
import { Card, notification, Typography } from "antd";
import { ShoppingCartOutlined, StarFilled } from "@ant-design/icons";
import "./Card.css";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { converPrice } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { addOrderFood } from "../../redux/slide/orderSlide";
import { useQuery } from "@tanstack/react-query";
import * as FoodService from "../../service/FoodService";

const { Title, Text } = Typography;

const CardComponent = (props) => {
  const { DaBan, GiaMonAn, GiamGia, TenMonAn, DanhGia, MoTa, HinhAnh, id } =
    props;
  const navigate = useNavigate();
  const handleDetailsFood = (id) => {
    navigate(`/Product/ProductDetail/${id}`);
  };
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [numFood, setNumFood] = useState(1);

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

  const handleAddOrderFood = () => {
    if (!user?.id) {
      navigate("/SignIn", { state: location?.pathname });
    } else {
      dispatch(
        addOrderFood({
          DonHangs: {
            TenMonAn: foodDetails?.TenMonAn,
            SoLuong: numFood,
            HinhAnh: foodDetails?.HinhAnh,
            GiaMonAn: foodDetails?.GiaMonAn,
            food: foodDetails?._id,
            GiamGia: foodDetails?.GiamGia,
          },
        })
      );
      notification.success({
        message: "Thành công",
        description: `Đã thêm ${foodDetails.TenMonAn} thành công!`,
        placement: "top",
        duration: 1,
      });
    }
  };

  return (
    <Card
      onClick={() => handleDetailsFood(id)}
      hoverable
      style={{
        width: "22rem",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        // transition: "transform 0.2s",
        transition: "transform 0.3s, box-shadow 0.3s",
      }}
      cover={
        <img
          src={HinhAnh}
          alt={TenMonAn}
          style={{
            height: "308px",
            width: "100%",
            objectFit: "cover",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
        />
      }
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <Title
        level={4}
        className="truncated-title"
        style={{ textAlign: "center", fontWeight: "bold", margin: "10px 0" }}
      >
        {TenMonAn}
      </Title>

      <Text
        className="truncated-title"
        style={{
          fontSize: "12px",
          color: "#777",
          fontWeight: "600",
          marginBottom: "10px",
          display: "block",
          textAlign: "center",
        }}
      >
        {MoTa}
      </Text>

      <div
        className="price-info"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <span style={{ fontSize: "20px", color: "#ff5b6a", fontWeight: "700" }}>
          {converPrice(GiaMonAn)}{" "}
          <span style={{ fontSize: "16px", color: "#999" }}>
            - {GiamGia || 0} %
          </span>
        </span>
        <span
          style={{
            fontSize: "16px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span>{DanhGia}</span>
          <StarFilled
            style={{
              fontSize: "16px",
              color: "rgb(253,216,54)",
              marginLeft: "4px",
            }}
          />
          <span style={{ marginLeft: "8px" }}>| Đã bán {DaBan || 0}</span>
        </span>
      </div>
      <ButtonComponent
        onClick={(e) => {
          e.stopPropagation();
          handleAddOrderFood();
        }}
        style={{
          width: "100%",
          background: "#ff5b6a",
          color: "#fff",
          borderRadius: "5px",
          padding: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.3s",
        }}
      >
        <ShoppingCartOutlined
          style={{ fontSize: "20px", marginRight: "8px" }}
        />
        Thêm vào giỏ
      </ButtonComponent>
    </Card>
  );
};

export default CardComponent;
