import React, { useState, useEffect } from "react";
import "./BackToTop.css"; // Tạo file CSS riêng để quản lý styles
import { CaretUpOutlined } from "@ant-design/icons";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Hàm xử lý sự kiện khi cuộn trang
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Hàm cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // useEffect để theo dõi sự kiện cuộn trang
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="back-to-top">
      {isVisible && (
        <button onClick={scrollToTop} className="back-to-top-btn">
          <CaretUpOutlined />
        </button>
      )}
    </div>
  );
};

export default BackToTop;
