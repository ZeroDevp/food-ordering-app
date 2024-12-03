// import { Card, Typography } from "antd";
// import React from "react";
// // import HinhAnh from "../../assets/img/chicken.png";

// const { Title, Text } = Typography;

// const CardBlogComponent = (props) => {
//   const { tieuDe, noiDungTomTat, noiDung, createdAt, hinhAnh } = props;
//   //, hinhAnh, noiDung, id

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   return (
//     <Card
//       //   onClick={() => handleDetailsFood(id)}
//       hoverable
//       style={{
//         width: "22rem",
//         borderRadius: "10px",
//         overflow: "hidden",
//         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//         transition: "transform 0.2s",
//       }}
//       cover={
//         <img
//           src={hinhAnh}
//           alt="test"
//           style={{
//             height: "308px",
//             width: "100%",
//             objectFit: "cover",
//             borderTopLeftRadius: "10px",
//             borderTopRightRadius: "10px",
//           }}
//         />
//       }
//     >
//       <Title
//         level={4}
//         className="truncated-title"
//         style={{ textAlign: "center", fontWeight: "bold", margin: "10px 0" }}
//       >
//         {tieuDe}
//       </Title>

//       <Text
//         className="truncated-title"
//         style={{
//           fontSize: "12px",
//           color: "#777",
//           fontWeight: "600",
//           marginBottom: "10px",
//           display: "block",
//           textAlign: "center",
//         }}
//       >
//         {noiDungTomTat}
//       </Text>

//       {/* <div
//         className="truncated-title"
//         style={{
//           fontSize: "12px",
//           color: "#777",
//           fontWeight: "600",
//           marginBottom: "10px",
//           display: "block",
//           textAlign: "center",
//         }}
//         dangerouslySetInnerHTML={{ __html: noiDung }}
//       /> */}

//       <div
//         className="price-info"
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           marginBottom: "10px",
//         }}
//       >
//         {formatDate(createdAt)}
//       </div>
//     </Card>
//   );
// };

// export default CardBlogComponent;

import { useQuery } from "@tanstack/react-query";
import { Card, Typography } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as BlogService from "../../service/BlogService";

const { Title, Text } = Typography;

const CardBlogComponent = (props) => {
  const { tieuDe, noiDungTomTat, createdAt, hinhAnh, id } = props;

  const navigate = useNavigate();
  const handleDetailsBlog = (id) => {
    navigate(`/Blog/BlogDetails/${id}`);
  };

  const location = useLocation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [numFood, setNumFood] = useState(1);

  //fnc getDetailsBlog
  const fetchGetDetailsBlog = async (context) => {
    const id = context?.querykey[1];
    const res = await BlogService.getDetailsBlog(id);
    return res.data;
  };

  const { data: blogDetails } = useQuery({
    queryKey: ["blog-details", id],
    queryFn: fetchGetDetailsBlog,
    enable: !!id,
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Card
      onClick={() => handleDetailsBlog(id)}
      hoverable
      style={{
        width: "100%",
        maxWidth: "320px",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s, box-shadow 0.3s",
      }}
      cover={
        <img
          src={hinhAnh}
          alt="Ảnh bài viết"
          style={{
            height: "200px",
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
      <div style={{ padding: "16px" }}>
        <Title
          level={4}
          style={{
            fontWeight: "bold",
            color: "#333",
            marginBottom: "10px",
            textAlign: "center",
            textTransform: "capitalize",
            fontSize: "14px",
          }}
        >
          {tieuDe}
        </Title>

        <Text
          style={{
            fontSize: "12px",
            color: "#777",
            fontWeight: "600",
            marginBottom: "10px",
            display: "block",
            textAlign: "left",
            height: "40px", // Giới hạn chiều cao
            overflow: "hidden", // Ẩn nội dung thừa
            textOverflow: "ellipsis", // Thêm dấu "..."
          }}
        >
          {noiDungTomTat}
        </Text>

        <div
          style={{
            marginTop: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: "12px",
              color: "#888",
            }}
          >
            {formatDate(createdAt)}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default CardBlogComponent;
