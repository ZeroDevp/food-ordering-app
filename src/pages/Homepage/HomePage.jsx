import React, { useEffect, useState } from "react";
import "./homePage.css";
import { NavLink } from "react-router-dom";
import { Carousel, Col, Pagination, Row } from "antd";
import CardComponent from "../../components/CardComponent/CardComponent";
import CardBlogComponent from "../../components/CardComponent/CardBlogComponent";
import BackToTop from "../../components/BackToTopComponent/BackToTopComponent";
import BannerTrongHieu from "../../assets/banner/BannerTrongHieu.png";
import * as FoodService from "../../service/FoodService";
import * as BlogService from "../../service/BlogService";
import { useQuery } from "@tanstack/react-query";

const HomePage = () => {
  const [setActiveItem] = useState("home");
  const [stateFood, setStateFood] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 4; // Number of items per page
  const [bestSellingFoods, setBestSellingFoods] = useState([]);

  const [stateBlog, setStateBlog] = useState([]);
  const [tinNoiBat, SetTinNoibat] = useState([]);

  ///
  const fetchFoodAll = async () => {
    const res = await FoodService.getAllFood();
    return res;
  };

  const fetchBlogAll = async () => {
    const res = await BlogService.getAllBlog();
    return res;
  };

  const { data: foods } = useQuery({
    queryKey: ["foods"],
    queryFn: fetchFoodAll,
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });

  const { data: blogs } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogAll,
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });

  // useEffect(() => {
  //   if (foods?.data?.length > 0) {
  //     setStateFood(foods.data);
  //   } else {
  //     setStateFood([]); // Reset stateFood if no data found
  //   }
  // }, [foods]);

  useEffect(() => {
    if (foods?.data?.length > 0) {
      setStateFood(foods.data);
      // Filter best selling foods (assuming DaBan indicates the number sold)
      const filteredBestSelling = foods.data.filter((food) => food.DaBan >= 10);
      setBestSellingFoods(filteredBestSelling);
    } else {
      setStateFood([]); // Reset stateFood if no data found
      setBestSellingFoods([]); // Reset best selling foods if no data found
    }
  }, [foods]);

  useEffect(() => {
    if (blogs?.data?.length > 0) {
      setStateBlog(blogs.data);
      const fillteredTinNoiBat = blogs.data.filter(
        (blog) => blog.tinNoiBat === true
      );
      SetTinNoibat(fillteredTinNoiBat);
    } else {
      setStateBlog([]);
      SetTinNoibat([]);
    }
  }, [blogs]);

  // Calculate the items to display based on the current page
  const indexOfLastFood = currentPage * itemsPerPage;
  const indexOfFirstFood = indexOfLastFood - itemsPerPage;
  // const currentFoods = stateFood.slice(indexOfFirstFood, indexOfLastFood); // Use stateFood for current items
  const currentBestSellingFoods = bestSellingFoods.slice(
    indexOfFirstFood,
    indexOfLastFood
  ); // Use bestSellingFoods for current items

  ///

  const indexOfLastBlog = currentPage * itemsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - itemsPerPage;
  const currentBlogNoibat = tinNoiBat.slice(indexOfFirstBlog, indexOfLastBlog);

  const handleTabClick = (item) => {
    setActiveItem(item);
  };

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

  return (
    <div className="main-content">
      {/* <product /> */}
      <Carousel autoplay>
        <div>
          <img width={"100%"} src={BannerTrongHieu} alt="banner1" />
        </div>
        <div>
          <img
            width={"100%"}
            src={require("../../assets/banner/banner_giamgia.jpg")}
            alt="banner1"
          />
        </div>
      </Carousel>

      <div className="container">
        <div className="menu-bar">
          <div className="swipper">
            <NavLink
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
              to="/Product"
              onClick={() => handleTabClick("product")}
            >
              <img
                src={require("../../assets/icon/icon-dathang.png")}
                alt="ThucDon"
              />
              <span>Thực đơn</span>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
              to="/Blog"
              onClick={() => handleTabClick("blog")}
            >
              <img src={require("../../assets/icon/blog.png")} alt="Blog" />
              <span>Tin Tức</span>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
              to="/Contact"
              onClick={() => handleTabClick("contact")}
            >
              <img
                src={require("../../assets/icon/contactNew.png")}
                alt="Liên hệ"
              />
              <span>Liên Hệ</span>
            </NavLink>
          </div>
        </div>

        <div className="sesion">
          <h2 className="head-title">
            <span>Bán chạy nhất</span>
          </h2>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <Row gutter={[16, 16]}>
            {currentBestSellingFoods.length > 0 ? (
              currentBestSellingFoods.map((food) => (
                <Col key={food._id} xs={24} sm={12} md={8} lg={6}>
                  <CardComponent
                    DaBan={food.DaBan}
                    DanhGia={food.DanhGia}
                    GiaMonAn={food.GiaMonAn}
                    HinhAnh={food.HinhAnh}
                    LoaiMonAn={food.LoaiMonAn}
                    GiamGia={food.GiamGia}
                    MoTa={food.MoTa}
                    TenMonAn={food.TenMonAn}
                    id={food._id}
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
                Không có thức ăn mà bạn đang tìm
              </div>
            )}
          </Row>

          {bestSellingFoods.length > 0 && ( // Only show pagination if there are results
            <div className="pagination">
              <Pagination
                current={currentPage} // Set current page
                pageSize={itemsPerPage} // Set items per page
                total={bestSellingFoods.length} // Set total items based on stateFood
                onChange={handlePageChange} // Handle page change
                itemRender={itemRender}
                className="custom-pagination"
              />
            </div>
          )}
        </div>
      </div>
      <div
        className="bg-img d-flex align-items-center"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/img/banner-1.jpg)`,
        }}
      >
        <div className="container">
          <div className="row d-flex justify-content-center align-items-center text-center">
            <div className="col-lg-8">
              <h3 className="title-h3">Trọng Hiếu FastFood, xin chào</h3>
              <p className="ma-28-semi text-light">
                Chúng tôi là Trọng Hiếu FastFood với hơn 100 cửa hàng trên khắp
                cả nước, chúng tôi mong muốn đem đến niềm vui ẩm thực cho mọi
                gia đình Việt bằng những món ăn chất lượng tốt, hương vị tuyệt
                hảo, dịch vụ chu đáo với một mức giá hợp lý... Hãy đến và thưởng
                thức nhé!
              </p>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "menu-item active" : "menu-item"
                }
                to="/Product"
                onClick={() => handleTabClick("product")}
              >
                <button className="btn-order">Đặt hàng ngay</button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="sesion">
          <h2 className="head-title">
            <span>Tin Tức</span>
          </h2>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <Row gutter={[16, 16]}>
            {currentBlogNoibat.length > 0 ? (
              currentBlogNoibat.map((blog) => (
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
          {tinNoiBat.length > 0 && ( // Only show pagination if there are results
            <div className="pagination">
              <Pagination
                current={currentPage} // Set current page
                pageSize={itemsPerPage} // Set items per page
                total={tinNoiBat.length} // Set total items based on stateFood
                onChange={handlePageChange} // Handle page change
                itemRender={itemRender}
                className="custom-pagination"
              />
            </div>
          )}
        </div>
      </div>
      <BackToTop />
    </div>
  );
};

export default HomePage;
