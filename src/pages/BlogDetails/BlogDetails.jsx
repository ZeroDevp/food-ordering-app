import React, { useState } from "react";
import { Card, Typography, Image, List } from "antd";

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import * as BlogService from "../../service/BlogService";
import { useQuery } from "@tanstack/react-query";

const { Title, Text } = Typography;
const BlogDetails = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [numFood, setNumFood] = useState(1);
  const { id } = useParams();
  const user = useSelector((state) => state.user);
  const onChange = (value) => {
    setNumFood(Number(value));
  };

  //fnc getDetailsBlog
  const fetchGetDetailsBlog = async (context) => {
    const id = context?.queryKey[1];
    const res = await BlogService.getDetailsBlog(id);
    return res.data;
  };

  const { data: blogDetails } = useQuery({
    queryKey: ["blog-details", id],
    queryFn: fetchGetDetailsBlog,
    enable: !!id,
  });

  console.log("data", blogDetails);

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "'Arial', sans-serif",
      }}
    >
      {/* Banner Image */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
          width: "100%",
          overflow: "hidden", // Ẩn phần hình ảnh bị tràn
          borderRadius: "10px",
          aspectRatio: "16/9", // Tạo tỉ lệ khung hình cố định
        }}
      >
        <Image
          preview={false}
          src={blogDetails?.hinhAnh} // Đường dẫn hình ảnh từ API
          alt="Bài viết"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover", // Cắt hình ảnh để phù hợp khung
            borderRadius: "10px",
          }}
        />
      </div>
      {/* Header */}
      <Title level={2} style={{ textAlign: "center", color: "#e63946" }}>
        {blogDetails?.tieuDe}
      </Title>

      {/* Nội dung chính */}
      <Card
        style={{
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "20px",
        }}
      >
        <div
          style={{ fontSize: "16px", color: "#555", lineHeight: "1.6" }}
          dangerouslySetInnerHTML={{ __html: blogDetails?.noiDung }}
        ></div>
      </Card>
    </div>
  );
};

export default BlogDetails;
