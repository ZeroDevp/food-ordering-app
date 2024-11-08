import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, theme } from "antd";
import SiderComponent from "../../../components/SiderComponent/SiderComponent";
import { useSelector } from "react-redux";
const { Header, Content } = Layout;

const UserAdmin = () => {
  const user = useSelector((state) => state?.user);
  const [marginLeft, setMarginLeft] = useState(280);
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setMarginLeft(collapsed ? 280 : 80);
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#FEE4CC" }}>
      <SiderComponent collapsed={collapsed} user={user} selectKey={"3"} />
      <Layout
        style={{
          height: "100%",
          minHeight: "750px",
          marginLeft: marginLeft,
          transition: "margin-left 0.5s ease",
          backgroundColor: "#FEE4CC",
        }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            backgroundColor: "#FEE4CC",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => toggleCollapsed()}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <h5 style={{ display: "inline-block", marginLeft: "20px" }}>
            QUẢN LÝ NGƯỜI DÙNG
          </h5>
        </Header>
        <Content
          style={{
            // height: "50vh",
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          Content
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserAdmin;
