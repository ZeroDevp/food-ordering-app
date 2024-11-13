// import React from "react";
// import { Card, Button, Typography } from "antd";
// import {
//   PlusOutlined,
//   ShoppingCartOutlined,
//   StarFilled,
// } from "@ant-design/icons";
// import "./Card.css";
// import { NavLink } from "react-router-dom";
// import ButtonComponent from "../ButtonComponent/ButtonComponent";

// const { Title } = Typography;

// const CardComponent = (props) => {
//   const { DaBan, GiaMonAn, GiamGia, TenMonAn, DanhGia, MoTa, HinhAnh } = props;
//   //HinhAnh,id, LoaiMonAn
//   return (
//     <NavLink to="/Product/ProductDetail" style={{ textDecoration: "none" }}>
//       <Card
//         hoverable
//         style={{
//           width: "22rem",
//           borderRadius: "10px",
//           overflow: "hidden",
//           boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//         }}
//         cover={
//           <img
//             src={HinhAnh}
//             alt="trungthu-1"
//             style={{
//               height: "308px",
//               width: "308px",
//               borderTopLeftRadius: "10px",
//               borderTopRightRadius: "10px",
//             }}
//           />
//         }
//       >
//         <Title
//           level={4}
//           className="truncated-title"
//           style={{ fontWeight: "bold" }}
//         >
//           {TenMonAn}
//         </Title>
//         {/* <span
//           style={{
//             fontSize: "14px",
//             color: "#000",
//             fontStyle: "italic",
//             fontWeight: "600",
//           }}
//         >
//           {LoaiMonAn}
//         </span> */}

//         <div className="card-footer">
//           <div className="price-info truncated-title">
//             <span
//               style={{ fontSize: "12px", color: "#ccc", fontWeight: "600" }}
//             >
//               {MoTa}
//             </span>
//             <span
//               style={{
//                 marginRight: "4px",
//                 fontSize: "25px",
//                 color: "#ff5b6a",
//                 fontWeight: "700",
//               }}
//             >
//               <span>{GiaMonAn}</span>
//               <span> - {GiamGia || 5}%</span>
//             </span>
//             <span
//               style={{
//                 marginRight: "4px",
//                 fontSize: "16px",
//                 fontWeight: "500",
//               }}
//             >
//               <span> {DanhGia}</span>{" "}
//               <StarFilled
//                 style={{ fontSize: "16px", color: "rgb(253,216,54" }}
//               />
//               <span> | Đã bán {DaBan || 1000}</span>
//             </span>
//             <div className="row">
//               <div className="col-md-6">
//                 <ButtonComponent
//                   // onClick={() => setOpen(true)}
//                   style={{
//                     paddingTop: "10px",
//                     width: "100%",
//                     background: "#ff5b6a",
//                     color: "#fff",
//                   }}
//                 >
//                   <ShoppingCartOutlined
//                     style={{
//                       display: "inline-flex",
//                       fontSize: "20px",
//                     }}
//                   />
//                 </ButtonComponent>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* <Button
//           text="Thêm món ăn"
//           size="large"
//           type="primary"
//           shape="square"
//           icon={
//             <PlusOutlined style={{ fontWeight: "700", fontSize: "20px" }} />
//           }
//           style={{
//             backgroundColor: "#ff4d4f",
//             borderColor: "#ff4d4f",
//             marginTop: "50px",
//             width: "50px",
//             height: "50px",
//           }}
//         /> */}
//       </Card>
//     </NavLink>
//   );
// };

// export default CardComponent;

import React from "react";
import { Card, Typography } from "antd";
import { ShoppingCartOutlined, StarFilled } from "@ant-design/icons";
import "./Card.css";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { converPrice } from "../../utils";

const { Title, Text } = Typography;

const CardComponent = (props) => {
  const { DaBan, GiaMonAn, GiamGia, TenMonAn, DanhGia, MoTa, HinhAnh, id } =
    props;
  const navigate = useNavigate();
  const handleDetailsFood = (id) => {
    navigate(`/Product/ProductDetail/${id}`);
  };
  return (
    // <NavLink to="/Product/ProductDetail" style={{ textDecoration: "none" }}>    </NavLink>
    <Card
      onClick={() => handleDetailsFood(id)}
      hoverable
      style={{
        width: "22rem",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s",
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
            - {converPrice(GiamGia || 5)}
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
          <span style={{ marginLeft: "8px" }}>| Đã bán {DaBan || 1000}</span>
        </span>
      </div>

      <ButtonComponent
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
