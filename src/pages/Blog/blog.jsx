import React, { useEffect, useState } from "react";
import BackToTop from "../../components/BackToTopComponent/BackToTopComponent";
import { Col, Pagination, Row } from "antd";
import CardBlogComponent from "../../components/CardComponent/CardBlogComponent";
import * as BlogService from "../../service/BlogService";
import { useQuery } from "@tanstack/react-query";

const Blog = () => {
  const [stateBlog, setStateBlog] = useState([]);
  const [tinNoiBat, SetTinNoibat] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 8; // Number of items per page

  const fetchAllBlog = async () => {
    const res = await BlogService.getAllBlog();
    return res;
  };

  const { data: blogs } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchAllBlog,
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (blogs?.data?.length > 0) {
      setStateBlog(blogs.data);
    } else {
      setStateBlog([]);
    }
  }, [blogs]);

  const itemRender = (current, type, originalElement) => {
    if (type === "page") {
      return (
        <div className={`dot ${current === currentPage ? "active" : ""}`}></div>
      );
    }
    return originalElement;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update current page state
  };

  const indexOfLastBlog = currentPage * itemsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - itemsPerPage;
  const currentBlog = stateBlog.slice(indexOfFirstBlog, indexOfLastBlog);

  return (
    <>
      <div className="container">
        <div style={{ padding: "20px" }}>
          <Row gutter={[16, 16]}>
            {currentBlog.length > 0 ? (
              currentBlog.map((blog) => (
                <Col key={blog._id} xs={24} sm={12} md={8} lg={6}>
                  <CardBlogComponent
                    tieuDe={blog.tieuDe}
                    hinhAnh={blog.hinhAnh}
                    noiDung={blog.noiDung}
                    noiDungTomTat={blog.noiDungTomTat}
                    id={blog._id}
                    createdAt={blog.createdAt}
                  />
                </Col>
              ))
            ) : (
              <div
                className="no-results"
                style={{
                  textAlign: "center",
                  color: "#ccc",
                  fontWeight: "600",
                  marginTop: "40px",
                  width: "100%",
                }}
              >
                Không có bài viết mà bạn đang tìm
              </div>
            )}
          </Row>
        </div>

        {stateBlog.length > 0 && ( // Only show pagination if there are results
          <div className="pagination">
            <Pagination
              current={currentPage} // Set current page
              pageSize={itemsPerPage} // Set items per page
              total={stateBlog.length} // Set total items based on stateFood
              onChange={handlePageChange} // Handle page change
              itemRender={itemRender}
              className="custom-pagination"
            />
          </div>
        )}
      </div>
      <BackToTop />
    </>
  );
};

export default Blog;
