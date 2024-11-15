// import React, { useEffect, useRef, useState } from "react";
// import { Col, Pagination, Row } from "antd";
// import CardComponent from "../../components/CardComponent/CardComponent";
// import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
// import BackToTop from "../../components/BackToTopComponent/BackToTopComponent";
// import "./Product.css";
// import * as FoodService from "../../service/FoodService";
// import { useQuery } from "@tanstack/react-query";
// import { useSelector } from "react-redux";
// import { useDebounce } from "../../hook/useDebounce";
// import { useLocation } from "react-router-dom";

// const FoodType = () => {
//   const searchFood = useSelector((state) => state.food?.search);
//   const [stateFood, setStateFood] = useState([]);
//   const searchDebounce = useDebounce(searchFood, 1000);
//   const refSearch = useRef();
//   const [currentPage, setCurrentPage] = useState(1); // State for current page
//   const itemsPerPage = 8; // Number of items per page

//   const fetchFoodAll = async (search) => {
//     const res = await FoodService.getAllFood(search);
//     if (search?.length > 0 || refSearch.current) {
//       setStateFood(res?.data);
//       return res || [];
//     } else {
//       return res;
//     }
//   };

//   const { state } = useLocation();
//   // const [foodsStatus,setFoodsStatus] = useState([])

//   const fetchFoodType = async (LoaiMonAn) => {
//     const res = await FoodService.getFoodType(LoaiMonAn);
//     if (res?.status === "OK") {
//       setStateFood(res?.data);
//     } else {
//     }
//   };

//   useEffect(() => {
//     if (state) {
//       fetchFoodType(state);
//     }
//   }, [state]);

//   useEffect(() => {
//     if (refSearch.current) {
//       fetchFoodAll(searchDebounce);
//     }
//     refSearch.current = true;
//   }, [searchDebounce]);

//   const { data: foods } = useQuery({
//     queryKey: ["foods"], // Include searchFood in the query key
//     queryFn: () => fetchFoodAll(searchFood),
//     retry: 3,
//     retryDelay: 1000,
//     keepPreviousData: true,
//   });

//   useEffect(() => {
//     if (foods?.data?.length > 0) {
//       setStateFood(foods.data);
//     } else {
//       setStateFood([]); // Reset stateFood if no data found
//     }
//   }, [foods]);

//   // Reset current page when searchFood changes
//   useEffect(() => {
//     setCurrentPage(1); // Reset to the first page when search changes
//   }, [searchFood]);

//   // Calculate the items to display based on the current page
//   const indexOfLastFood = currentPage * itemsPerPage;
//   const indexOfFirstFood = indexOfLastFood - itemsPerPage;
//   const currentFoods = stateFood.slice(indexOfFirstFood, indexOfLastFood); // Use stateFood for current items

//   const itemRender = (current, type, originalElement) => {
//     if (type === "page") {
//       return (
//         <div className={`dot ${current === currentPage ? "active" : ""}`}></div>
//       );
//     }
//     return originalElement;
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page); // Update current page state
//   };

//   return (
//     <>
//       <div className="container">
//         <NavbarComponent />

//         <div style={{ padding: "20px" }}>
//           <Row gutter={[16, 16]}>
//             {currentFoods.length > 0 ? (
//               currentFoods.map((food) => (
//                 <Col key={food._id} xs={24} sm={12} md={8} lg={6}>
//                   <CardComponent
//                     DaBan={food.DaBan}
//                     DanhGia={food.DanhGia}
//                     GiaMonAn={food.GiaMonAn}
//                     HinhAnh={food.HinhAnh}
//                     LoaiMonAn={food.LoaiMonAn}
//                     GiamGia={food.GiamGia}
//                     MoTa={food.MoTa}
//                     TenMonAn={food.TenMonAn}
//                     id={food._id}
//                   />
//                 </Col>
//               ))
//             ) : (
//               <div
//                 className="no-results"
//                 style={{
//                   textAlign: "center",
//                   color: "#ccc",
//                   fontWeight: "600",
//                   marginTop: "40px",
//                   width: "100%",
//                 }}
//               >
//                 Không có thức ăn mà bạn đang tìm
//               </div>
//             )}
//           </Row>
//         </div>

//         {stateFood.length > 0 && ( // Only show pagination if there are results
//           <div className="pagination">
//             <Pagination
//               current={currentPage} // Set current page
//               pageSize={itemsPerPage} // Set items per page
//               total={stateFood.length} // Set total items based on stateFood
//               onChange={handlePageChange} // Handle page change
//               itemRender={itemRender}
//               className="custom-pagination"
//             />
//           </div>
//         )}
//       </div>
//       <BackToTop />
//     </>
//   );
// };

// export default FoodType;

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
