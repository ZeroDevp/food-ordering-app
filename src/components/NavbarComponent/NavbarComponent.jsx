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

import React, { useState } from "react";
import "./NavbarComponent.css";
import { Pagination } from "antd";

const NavbarComponent = () => {
  // Quản lý danh sách danh mục và trang hiện tại
  const [categories] = useState([
    "Thức uống",
    "Thức ăn nhẹ",
    "Cơm - Mì ý",
    "Phần ăn nhóm",
    "Gà rán phần",
    "Gà rán",
    "Burger",
    "Sốt ăn kèm",
    "More cate",
    "More cate",
    "More cate",
    "More cate",
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // Số lượng danh mục hiển thị trên mỗi trang

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
    const currentCategories = categories.slice(startIndex, endIndex);

    return currentCategories.map((category, index) => (
      <div key={index} className="list-cate">
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
        {renderCategory(categories, currentPage, pageSize)}
      </div>
      {/* Pagination điều khiển trang hiện tại */}
      <Pagination
        current={currentPage}
        total={categories.length}
        pageSize={pageSize}
        onChange={handlePageChange}
        itemRender={itemRender}
        className="custom-pagination"
      />
    </>
  );
};

export default NavbarComponent;
