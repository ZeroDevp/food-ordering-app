import React, { useEffect, useState } from "react";
import { Col, Pagination, Row } from "antd";
import CardComponent from "../../components/CardComponent/CardComponent";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import BackToTop from "../../components/BackToTopComponent/BackToTopComponent";
import "./Product.css";
import * as FoodService from "../../service/FoodService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hook/useDebounce";
import { useLocation } from "react-router-dom";

const FoodType = () => {
  const searchFood = useSelector((state) => state.food?.search);
  const searchDebounce = useDebounce(searchFood, 1000);
  const { state } = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchFoodAll = async (search) => {
    const res = await FoodService.getAllFood(search);
    return res?.data || [];
  };

  const fetchFoodType = async (LoaiMonAn) => {
    const res = await FoodService.getFoodType(LoaiMonAn);
    return res?.data || [];
  };

  const { data: foods } = useQuery({
    queryKey: ["foods", searchDebounce, state],
    queryFn: () =>
      state ? fetchFoodType(state) : fetchFoodAll(searchDebounce),
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchFood, state]);

  const indexOfLastFood = currentPage * itemsPerPage;
  const indexOfFirstFood = indexOfLastFood - itemsPerPage;
  const currentFoods = foods?.slice(indexOfFirstFood, indexOfLastFood) || [];

  const handlePageChange = (page) => setCurrentPage(page);

  const itemRender = (current, type, originalElement) =>
    type === "page" ? (
      <div className={`dot ${current === currentPage ? "active" : ""}`}></div>
    ) : (
      originalElement
    );

  return (
    <>
      <div className="container">
        <NavbarComponent />

        <div style={{ padding: "20px" }}>
          <Row gutter={[16, 16]}>
            {currentFoods.length > 0 ? (
              currentFoods.map((food) => (
                <Col key={food._id} xs={24} sm={12} md={8} lg={6}>
                  <CardComponent {...food} />
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
        </div>

        {foods?.length > 0 && (
          <div className="pagination">
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={foods.length}
              onChange={handlePageChange}
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

export default FoodType;
