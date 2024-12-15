import React, { useState } from "react";
import {
  DollarCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, Typography, Row, Col, Card } from "antd";
import SiderComponent from "../../../components/SiderComponent/SiderComponent";
import { useSelector } from "react-redux";
import Chart from "react-apexcharts";
import { useQuery } from "@tanstack/react-query";
import * as UserService from "../../../service/UserService";
import * as OrderService from "../../../service/OrderService";
import * as FoodService from "../../../service/FoodService";
import { converPrice, truncateDescription } from "../../../utils";
import { Radio } from "antd";

import TableAdminComponent from "../../../components/TableAdminComponent/TableAdminComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import PieChartComponent from "../../../components/PieChartComponent/PieChartComponent";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
  const user = useSelector((state) => state?.user);
  const [collapsed, setCollapsed] = useState(true);
  const [filter, setFilter] = useState("day"); // Lựa chọn mặc định: "day"
  const navigate = useNavigate("");

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  //days
  const calculateDailyRevenue = (orders) => {
    if (!orders?.data) return {};

    // Group by date and calculate revenue
    return orders.data
      .filter((order) => order.DaThanhToan) // Lọc đơn hàng đã thanh toán
      .reduce((acc, order) => {
        const dateObj = new Date(order.createdAt);
        const date = `${String(dateObj.getDate()).padStart(2, "0")}-${String(
          dateObj.getMonth() + 1
        ).padStart(2, "0")}-${dateObj.getFullYear()}`; // Định dạng dd/mm/yyyy
        acc[date] = (acc[date] || 0) + order.TongTien; // Cộng dồn doanh thu
        return acc;
      }, {});
  };

  //months
  const calculateMonthlyRevenue = (orders) => {
    if (!orders?.data) return {};

    return orders.data
      .filter((order) => order.DaThanhToan)
      .reduce((acc, order) => {
        const date = new Date(order.createdAt);
        const month = `${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${date.getFullYear()}`; // Lấy tháng theo định dạng YYYY-MM
        acc[month] = (acc[month] || 0) + order.TongTien;
        return acc;
      }, {});
  };

  //years
  const calculateYearlyRevenue = (orders) => {
    if (!orders?.data) return {};

    return orders.data
      .filter((order) => order.DaThanhToan)
      .reduce((acc, order) => {
        const year = new Date(order.createdAt).getFullYear(); // Lấy năm
        acc[year] = (acc[year] || 0) + order.TongTien;
        return acc;
      }, {});
  };
  // Fetch data
  const { isLoading: isLoadingUser, data: users } = useQuery({
    queryKey: ["users"],
    queryFn: UserService.getAllUser,
  });

  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: OrderService.getAllOrder,
  });

  const { data: foods } = useQuery({
    queryKey: ["foods"],
    queryFn: FoodService.getAllFood,
  });

  // const dailyRevenue = calculateDailyRevenue(orders);
  // const dailyCategories = Object.keys(dailyRevenue); // Danh sách các ngày
  // const dailyData = Object.values(dailyRevenue); // Danh sách doanh thu theo ngày

  // const monthlyRevenue = calculateMonthlyRevenue(orders);
  // const monthlyCategories = Object.keys(monthlyRevenue); // Danh sách các tháng
  // const monthlyData = Object.values(monthlyRevenue); // Danh sách doanh thu theo tháng

  // const yearlyRevenue = calculateYearlyRevenue(orders);
  // const yearlyCategories = Object.keys(yearlyRevenue); // Danh sách các năm
  // const yearlyData = Object.values(yearlyRevenue); // Danh sách doanh thu theo năm

  const dailyRevenue = calculateDailyRevenue(orders);
  const dailyCategories = Object.keys(dailyRevenue).sort(
    (a, b) => new Date(a) - new Date(b)
  );
  const dailyData = dailyCategories.map((date) => dailyRevenue[date]);

  const monthlyRevenue = calculateMonthlyRevenue(orders);
  const monthlyCategories = Object.keys(monthlyRevenue).sort();
  const monthlyData = monthlyCategories.map((month) => monthlyRevenue[month]);

  const yearlyRevenue = calculateYearlyRevenue(orders);
  const yearlyCategories = Object.keys(yearlyRevenue).sort((a, b) => a - b);
  const yearlyData = yearlyCategories.map((year) => yearlyRevenue[year]);

  const getChartData = () => {
    switch (filter) {
      case "day":
        return { series: dailyChartSeries, options: dailyChartOptions }; // Biểu đồ theo ngày
      case "month":
        return { series: monthlyChartSeries, options: monthlyChartOptions }; // Biểu đồ theo tháng
      case "year":
        return { series: yearlyChartSeries, options: yearlyChartOptions }; // Biểu đồ theo năm
      default:
        return { series: [], options: {} }; // Mặc định (trường hợp lỗi)
    }
  };

  // Tổng doanh thu
  const totalRevenue = orders?.data
    ?.filter((order) => order.DaThanhToan)
    ?.reduce((total, order) => total + order.TongTien, 0);

  // Biểu đồ

  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      dropShadow: {
        enabled: true,
        top: 2,
        left: 2,
        blur: 4,
        opacity: 0.2,
      },
    },
    colors: ["#007bff", "#28a745", "#ffc107", "#dc3545", "#6f42c1"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 5, // Bo góc cho cột
      },
    },
    dataLabels: {
      enabled: true, // Hiển thị giá trị trên cột
      formatter: function (value) {
        return value.toLocaleString("vi-VN");
      },
      style: {
        fontSize: "10px",
        colors: ["#fff"],
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: {
        style: {
          colors: "#9C9C9C",
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#9C9C9C",
          fontSize: "14px",
        },
        formatter: function (value) {
          return value.toLocaleString("vi-VN");
        },
      },
    },

    tooltip: {
      theme: "dark", // Giao diện tối
      y: {
        formatter: function (value) {
          return value.toLocaleString("vi-VN") + " VNĐ"; // Hiển thị tiền tệ
        },
      },
    },
    grid: {
      borderColor: "#e7e7e7",
      strokeDashArray: 4,
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: { height: 300 },
          xaxis: { labels: { style: { fontSize: "12px" } } },
          title: { style: { fontSize: "14px" } },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: { height: 250 },
          xaxis: { labels: { style: { fontSize: "10px" } } },
          title: { style: { fontSize: "12px" } },
        },
      },
    ],
  };

  //days
  const dailyChartSeries = [{ name: "Doanh thu", data: dailyData }];

  const dailyChartOptions = {
    ...chartOptions,
    xaxis: {
      categories: dailyCategories,
      labels: {
        style: {
          colors: "#9C9C9C",
          fontSize: "14px",
          // fontWeight: "bold",
        },
      },
    }, // Gán danh sách ngày làm nhãn trục X
    // title: { text: "Doanh thu theo ngày", align: "center" },
  };

  //months
  const monthlyChartSeries = [{ name: "Doanh thu", data: monthlyData }];

  const monthlyChartOptions = {
    ...chartOptions,
    xaxis: {
      categories: monthlyCategories,
      labels: {
        style: {
          colors: "#9C9C9C",
          fontSize: "14px",
          // fontWeight: "bold",
        },
      },
    }, // Gán danh sách tháng làm nhãn trục X
    // title: { text: "Doanh thu theo tháng", align: "center" },
  };

  //year
  const yearlyChartSeries = [{ name: "Doanh thu", data: yearlyData }];

  const yearlyChartOptions = {
    ...chartOptions,
    xaxis: {
      categories: yearlyCategories,
      labels: {
        style: {
          colors: "#9C9C9C",
          fontSize: "14px",
          // fontWeight: "bold",
        },
      },
    }, // Gán danh sách năm làm nhãn trục X
    // title: { text: "Doanh thu theo năm", align: "center" },
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f4f5f7" }}>
      <SiderComponent collapsed={collapsed} user={user} selectKey="1" />
      <Layout style={{ marginLeft: collapsed ? 80 : 280, transition: "0.5s" }}>
        {/* Header */}
        <Header
          style={{
            padding: "0 20px",
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            style={{ fontSize: 18 }}
          />
          <Text strong style={{ marginLeft: 20, fontSize: 22 }}>
            TRANG CHỦ QUẢN LÝ
          </Text>
        </Header>

        {/* Content */}
        <Content
          style={{
            padding: "20px",
            background: "linear-gradient(135deg, #141e30, #243b55)", // Màu nền gradient đậm
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          {/* Phần tiêu đề */}
          <div
            style={{
              textAlign: "center",
              padding: "20px 0",
            }}
          >
            <Title level={2} style={{ color: "#fff", fontWeight: "bold" }}>
              Trang Chủ Tổng Quan
            </Title>
            <Text style={{ color: "#ddd" }}>Cập nhật thông tin bán hàng</Text>
          </div>

          {/* Vùng Cards */}
          <Row
            gutter={[20, 20]}
            style={{
              justifyContent: "center",
            }}
          >
            {/* Card: Người dùng */}
            <Col
              xs={24}
              sm={12}
              md={6}
              onClick={() => navigate("/system/UserAdmin")}
            >
              <div
                style={{
                  padding: "20px",
                  borderRadius: "20px",
                  background: "linear-gradient(145deg, #00c6ff, #0072ff)", // Gradient màu sáng
                  textAlign: "center",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  transform: "scale(1)",
                  transition: "transform 0.3s ease-in-out",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                <UserOutlined style={{ fontSize: "40px", color: "#fff" }} />
                <Title level={3} style={{ color: "#fff", margin: "10px 0" }}>
                  {users?.data?.length || 0}
                </Title>
                <Text style={{ color: "#e0f7fa" }}>Người dùng</Text>
              </div>
            </Col>

            {/* Card: Đơn hàng */}
            <Col
              xs={24}
              sm={12}
              md={6}
              onClick={() => navigate("/system/OrderAdmin")}
            >
              <div
                style={{
                  padding: "20px",
                  borderRadius: "20px",
                  background: "linear-gradient(145deg, #ff9a9e, #fecfef)", // Gradient màu đỏ hồng
                  textAlign: "center",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  transform: "scale(1)",
                  transition: "transform 0.3s ease-in-out",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                <ShoppingCartOutlined
                  style={{ fontSize: "40px", color: "#fff" }}
                />
                <Title level={3} style={{ color: "#fff", margin: "10px 0" }}>
                  {orders?.data?.length || 0}
                </Title>
                <Text style={{ color: "#e0f7fa" }}>Đơn hàng</Text>
              </div>
            </Col>

            {/* Card: món ăn */}
            <Col
              xs={24}
              sm={12}
              md={6}
              onClick={() => navigate("/system/FoodAdmin")}
            >
              <div
                style={{
                  padding: "20px",
                  borderRadius: "20px",
                  background: "linear-gradient(145deg, #ff7e5f, #feb47b)", // Gradient màu đỏ hồng
                  textAlign: "center",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  transform: "scale(1)",
                  transition: "transform 0.3s ease-in-out",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                <FontAwesomeIcon
                  icon={faUtensils}
                  style={{ fontSize: "40px", color: "#fff" }}
                />
                <Title level={3} style={{ color: "#fff", margin: "10px 0" }}>
                  {foods?.data?.length || 0}
                </Title>
                <Text style={{ color: "#e0f7fa" }}>Món ăn</Text>
              </div>
            </Col>

            {/* Card: Doanh thu */}
            <Col xs={24} sm={12} md={6}>
              <div
                style={{
                  padding: "20px",
                  borderRadius: "20px",
                  background: "linear-gradient(145deg, #1e3c72, #2a5298)", // Gradient xanh đậm
                  textAlign: "center",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  transform: "scale(1)",
                  transition: "transform 0.3s ease-in-out",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                <DollarCircleOutlined
                  style={{ fontSize: "40px", color: "#fff" }}
                />
                <Title level={3} style={{ color: "#fff", margin: "10px 0" }}>
                  {converPrice(totalRevenue || 0)}
                </Title>
                <Text style={{ color: "#b3cde0" }}>Doanh thu</Text>
              </div>
            </Col>
          </Row>

          {/* Biểu đồ và Bảng */}
          <Row gutter={[20, 20]}>
            {/* Biểu đồ */}
            <Col xs={24} md={12}>
              <Card
                title={<Text style={{ color: "#fff" }}>Biểu đồ doanh thu</Text>}
                style={{
                  background: "#1c2833",
                  borderRadius: "20px",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                  color: "#fff",
                }}
              >
                <Radio.Group
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{ marginBottom: 16 }}
                >
                  <Radio.Button value="day">Theo ngày</Radio.Button>
                  <Radio.Button value="month">Theo tháng</Radio.Button>
                  <Radio.Button value="year">Theo năm</Radio.Button>
                </Radio.Group>
                <Chart
                  options={getChartData().options}
                  series={getChartData().series}
                  type="bar"
                  height={440}
                />
              </Card>
            </Col>

            {/* Bảng */}
            <Col xs={24} md={12}>
              <Card
                title={<Text style={{ color: "#fff" }}>Thống kê bán hàng</Text>}
                style={{
                  background: "#2c3e50",
                  borderRadius: "20px",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                }}
              >
                {/* <TableAdminComponent
                  columns={columns}
                  isLoading={isLoadingUser}
                  pagination={{ position: ["bottomCenter"], pageSize: 6 }}
                  data={dataTable}
                /> */}

                <PieChartComponent data={orders?.data} />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
