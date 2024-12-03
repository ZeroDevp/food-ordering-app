import React from "react";
import { Layout, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faMoneyBill1,
  faNewspaper,
  faRightFromBracket,
  faUser,
  faUserShield,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";

const { Sider } = Layout;

const SiderComponent = ({ collapsed, user, selectKey }) => {
  //   const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate("/");
  };

  const getStyle = () => ({
    Link: { textDecoration: "none" },
  });

  const styles = getStyle();
  return (
    <Sider
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        // background: "#ff5b6a",
        // background: "#A73E14",
      }}
      width={280}
      trigger={null}
      breakpoint="lg"
      collapsible
      collapsed={collapsed}
    >
      <div
        style={{
          // border: "1px solid #AC1A08",
          borderRadius: "10px",
          margin: "10px 5px",
          // background: "#AC1A08",
        }}
      >
        <p
          className="mt-3"
          style={{
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "600",
            color: "#fff",
            textTransform: "capitalize",
          }}
        >
          {collapsed ? <FontAwesomeIcon icon={faUserShield} /> : user?.HoTen}
        </p>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        className="mt-3"
        defaultSelectedKeys={[selectKey]}
        items={[
          {
            key: "1",
            icon: <FontAwesomeIcon icon={faChartLine} />,
            label: (
              <Link to="/system/Admin" style={styles.Link}>
                Trang chủ
              </Link>
            ),
          },
          {
            key: "2",
            icon: <FontAwesomeIcon icon={faUtensils} />,
            label: (
              <Link to="/system/FoodAdmin" style={styles.Link}>
                Quản lý Thức ăn
              </Link>
            ),
          },
          {
            key: "3",
            icon: <FontAwesomeIcon icon={faUser} />,
            label: (
              <Link to="/system/UserAdmin" style={styles.Link}>
                Quản Lý Người Dùng
              </Link>
            ),
          },
          {
            key: "4",
            icon: <FontAwesomeIcon icon={faMoneyBill1} />,
            label: (
              <Link to="/system/OrderAdmin" style={styles.Link}>
                Quản Lý Đơn Hàng
              </Link>
            ),
          },
          {
            key: "5",
            icon: <FontAwesomeIcon icon={faNewspaper} />,
            label: (
              <Link to="/system/BlogAdmin" style={styles.Link}>
                Quản Lý Bài Viết
              </Link>
            ),
          },
        ]}
      />
      <Menu
        theme="dark"
        mode="inline"
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
        items={[
          {
            key: "5",
            icon: <FontAwesomeIcon icon={faRightFromBracket} />,
            label: (
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
                style={styles.Link}
              >
                Quay về trang người dùng
              </Link>
            ),
          },
        ]}
      />
      {/* <Menu
        theme="dark"
        mode="inline"
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        <Menu.Item key="5" icon={<LogoutOutlined />}>
          <Link
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
            style={styles.Link}
          >
            Quay về trang người dùng
          </Link>
        </Menu.Item>
      </Menu> */}
    </Sider>
  );
};

export default SiderComponent;
