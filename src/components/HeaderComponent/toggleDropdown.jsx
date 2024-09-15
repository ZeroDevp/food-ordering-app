import React, { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space } from "antd";
import "./header.css";

const ToggleDropdown = () => {
  // State to keep track of selected language
  const [selectedLanguage, setSelectedLanguage] = useState("VI");

  // Handle when a menu item is clicked
  const handleMenuClick = (e) => {
    const language = items.find((item) => item.key === e.key).label;
    setSelectedLanguage(language); // Update the button text to the selected language
    // message.info(`Bạn đã chọn ${language}`);
    // console.log("Selected language:", language);
  };

  // Dropdown items
  const items = [
    {
      label: "VI",
      key: "1",
    },
    {
      label: "EN",
      key: "2",
    },
  ];

  // Menu properties
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <Space wrap className="language-btn">
      <Dropdown menu={menuProps}>
        <Button>
          <Space>
            {selectedLanguage} {/* Display the selected language here */}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </Space>
  );
};

export default ToggleDropdown;
