import React from "react";
import "./NavbarComponent.css";

const NavbarComponent = () => {
  const renderCategory = (type, option) => {
    switch (type) {
      case "text":
        return option.map((option) => {
          return (
            // <ul>
            //   <li className="list-cate">{option}</li>
            // </ul>
            <div className="list-cate">{option}</div>
          );
        });
      default:
        return {};
    }
  };
  return (
    <div className="category">
      {renderCategory("text", [
        "Thức uống",
        "Thức ăn nhẹ",
        "Cơm - Mì ý",
        "Phần ăn nhóm",
        "Gà rán phần",
        "Gà rán",
        "Burger",
      ])}
    </div>
  );
};

export default NavbarComponent;
