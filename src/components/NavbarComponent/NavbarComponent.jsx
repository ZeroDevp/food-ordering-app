// import React, { useState } from "react";
// import "./NavbarComponent.css";
// import { Pagination } from "antd";

// const NavbarComponent = () => {
//   // Quản lý danh sách danh mục và trang hiện tại
//   const [categories] = useState([
//     "Thức uống",
//     "Thức ăn nhẹ",
//     "Cơm - Mì ý",
//     "Phần ăn nhóm",
//     "Gà rán phần",
//     "Gà rán",
//     "Burger",
//   ]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 6; // Số lượng danh mục hiển thị trên mỗi trang

//   // Xử lý việc render các dấu chấm trong Pagination
//   const itemRender = (current, type, originalElement) => {
//     if (type === "page") {
//       return (
//         <div className={`dot ${current === currentPage ? "active" : ""}`}></div>
//       );
//     }
//     return originalElement;
//   };

//   // Hàm này sẽ trả về các danh mục hiển thị dựa trên trang hiện tại
//   const renderCategory = (categories, currentPage, pageSize) => {
//     const startIndex = (currentPage - 1) * pageSize;
//     const endIndex = startIndex + pageSize;
//     const currentCategories = categories.slice(startIndex, endIndex);

//     return currentCategories.map((category, index) => (
//       <div key={index} className="list-cate">
//         {category}
//       </div>
//     ));
//   };

//   // Xử lý khi người dùng nhấn chuyển trang
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   return (
//     <>
//       <div className="category">
//         {/* Hiển thị danh mục tương ứng với trang hiện tại */}
//         {renderCategory(categories, currentPage, pageSize)}
//       </div>
//       {/* Pagination điều khiển trang hiện tại */}
//       <Pagination
//         current={currentPage}
//         total={categories.length}
//         pageSize={pageSize}
//         onChange={handlePageChange}
//         itemRender={itemRender}
//         className="custom-pagination"
//       />
//     </>
//   );
// };

// export default NavbarComponent;

import React, { useEffect, useState } from "react";
import "./NavbarComponent.css";
import { Pagination } from "antd";
import * as FoodService from "../../service/FoodService";
import { useNavigate } from "react-router-dom";

const NavbarComponent = () => {
  const [typeFood, setTypeFood] = useState([]);
  const navigate = useNavigate();

  const handleNavigate = (LoaiMonAn) => {
    navigate(
      `/Product/${LoaiMonAn.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        ?.replace(/ /g, "_")}`,
      { state: LoaiMonAn }
    );
  };

  const fetchAllTypefood = async () => {
    const res = await FoodService.getAllTypeFood();
    if (res?.status === "OK") {
      setTypeFood(res?.data);
    }
  };

  useEffect(() => {
    fetchAllTypefood();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // Số lượng danh mục hiển thị trên mỗi trang

  // Xử lý việc render các dấu chấm trong Pagination
  const itemRender = (current, type, originalElement) => {
    if (type === "page") {
      return (
        <div className={`dot ${current === currentPage ? "active" : ""}`}></div>
      );
    }
    return originalElement;
  };

  // Hàm này sẽ trả về các danh mục hiển thị dựa trên trang hiện tại
  const renderCategory = (categories, currentPage, pageSize) => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentCategories = typeFood.slice(startIndex, endIndex);

    return currentCategories.map((category, index) => (
      <div
        key={index}
        className="list-cate"
        onClick={() => handleNavigate(category)}
      >
        {category}
      </div>
    ));
  };

  // Xử lý khi người dùng nhấn chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="category">
        {/* Hiển thị danh mục tương ứng với trang hiện tại */}
        {renderCategory(typeFood, currentPage, pageSize)}
      </div>
      {/* Pagination điều khiển trang hiện tại */}
      <Pagination
        current={currentPage}
        total={typeFood.length}
        pageSize={pageSize}
        onChange={handlePageChange}
        itemRender={itemRender}
        className="custom-pagination"
      />
    </>
  );
};

export default NavbarComponent;
