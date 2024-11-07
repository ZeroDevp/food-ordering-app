import React from "react";
import { Pagination } from "antd";
import CardComponent from "../../components/CardComponent/CardComponent";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import BackToTop from "../../components/BackToTopComponent/BackToTopComponent";
import "./Product.css";
import * as FoodService from "../../service/FoodService";
import { useQuery } from "@tanstack/react-query";

const ProductPage = () => {
  const fetchFoodAll = async () => {
    const res = await FoodService.getAllFood();
    return res;
  };

  const { data: foods } = useQuery({
    queryKey: ["foods"],
    queryFn: fetchFoodAll,
    retry: 3,
    retryDelay: 1000,
  });

  const itemRender = (current, type, originalElement) => {
    if (type === "page") {
      return <div className={`dot ${current === 1 ? "active" : ""}`}></div>;
    }
    return originalElement;
  };
  return (
    <>
      <div className="container">
        <NavbarComponent />
        <div className="row d-flex flex-wrap">
          {foods?.data?.map((food) => (
            <div
              key={food._id}
              className="col-md-3"
              style={{ marginBottom: "20px" }}
            >
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
            </div>
          ))}
        </div>

        <div className="pagination">
          <Pagination
            defaultCurrent={2}
            total={50}
            itemRender={itemRender}
            className="custom-pagination"
          />
        </div>
      </div>
      <BackToTop />
    </>
  );
};

export default ProductPage;
