import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
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

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
  const user = useSelector((state) => state?.user);
  const [collapsed, setCollapsed] = useState(true);
  const [filter, setFilter] = useState("day"); // Lựa chọn mặc định: "day"

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
        const date = new Date(order.createdAt).toISOString().split("T")[0]; // Lấy ngày theo định dạng YYYY-MM-DD
        acc[date] = (acc[date] || 0) + order.TongTien; // Cộng dồn doanh thu dạng số
        return acc;
      }, {});

    // Format revenue values using converPrice
  };

  //months
  const calculateMonthlyRevenue = (orders) => {
    if (!orders?.data) return {};

    return orders.data
      .filter((order) => order.DaThanhToan)
      .reduce((acc, order) => {
        const date = new Date(order.createdAt);
        const month = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`; // Lấy tháng theo định dạng YYYY-MM
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

  const dailyRevenue = calculateDailyRevenue(orders);
  const dailyCategories = Object.keys(dailyRevenue); // Danh sách các ngày
  const dailyData = Object.values(dailyRevenue); // Danh sách doanh thu theo ngày

  const monthlyRevenue = calculateMonthlyRevenue(orders);
  const monthlyCategories = Object.keys(monthlyRevenue); // Danh sách các tháng
  const monthlyData = Object.values(monthlyRevenue); // Danh sách doanh thu theo tháng

  const yearlyRevenue = calculateYearlyRevenue(orders);
  const yearlyCategories = Object.keys(yearlyRevenue); // Danh sách các năm
  const yearlyData = Object.values(yearlyRevenue); // Danh sách doanh thu theo năm

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
    chart: { type: "bar", height: 350, toolbar: { show: false } },
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
    },
    title: { text: "Doanh thu theo tháng", align: "left" },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: { height: 300 },
          xaxis: { labels: { style: { fontSize: "16px" } } },
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

  // const chartSeries = [{ name: "Doanh thu", data: monthlyRevenue }];

  //days
  const dailyChartSeries = [{ name: "Doanh thu", data: dailyData }];

  const dailyChartOptions = {
    ...chartOptions,
    xaxis: { categories: dailyCategories }, // Gán danh sách ngày làm nhãn trục X
    title: { text: "Doanh thu theo ngày", align: "left" },
  };

  //months
  const monthlyChartSeries = [{ name: "Doanh thu", data: monthlyData }];

  const monthlyChartOptions = {
    ...chartOptions,
    xaxis: { categories: monthlyCategories }, // Gán danh sách tháng làm nhãn trục X
    title: { text: "Doanh thu theo tháng", align: "left" },
  };

  //year
  const yearlyChartSeries = [{ name: "Doanh thu", data: yearlyData }];

  const yearlyChartOptions = {
    ...chartOptions,
    xaxis: { categories: yearlyCategories }, // Gán danh sách năm làm nhãn trục X
    title: { text: "Doanh thu theo năm", align: "left" },
  };

  const columns = [
    {
      title: <div style={{ textAlign: "center" }}>Họ và tên</div>,
      dataIndex: "HoTen",
      width: "30%",
      responsive: ["lg"],
      sorter: (a, b) => a.HoTen.length - b.HoTen.length,
    },
    {
      title: <div style={{ textAlign: "center" }}>Email</div>,
      dataIndex: "Email",
      width: "30%",
      responsive: ["md"],
    },

    {
      title: <div style={{ textAlign: "center" }}>Quản lý</div>,
      dataIndex: "isAdmin",
      width: "30%",
      align: "center",
      responsive: ["md"],
    },

    {
      title: <div style={{ textAlign: "center" }}>Điện thoại</div>,
      dataIndex: "DienThoai",
      align: "center",
      width: "30%",
      responsive: ["lg"],
      // sorter: (a, b) => a.LoaiMonAn - b.LoaiMonAn,
    },
  ];

  const dataTable =
    users?.data?.length &&
    users?.data?.map((user) => {
      return {
        ...user,
        key: user._id,
        isAdmin: user.isAdmin ? "Admin" : "User",
        MatKhau: truncateDescription(user.MatKhau, 100),
        // GiamGia: user.GiamGia,
      };
    });

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
        <Content style={{ margin: "24px 16px", padding: 24 }}>
          <Title level={3} style={{ color: "#333" }}>
            TỔNG QUAN
          </Title>
          <Row gutter={[16, 16]}>
            {/* Card: Số lượng người dùng */}
            <Col xs={24} sm={12} md={6}>
              <Card
                hoverable
                style={{
                  textAlign: "center",
                  borderRadius: 10,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#ffffff",
                }}
              >
                <Title level={4} style={{ color: "#007bff" }}>
                  {users?.data?.length || 0}
                </Title>
                <Text>Số lượng người dùng</Text>
              </Card>
            </Col>

            {/* Card: Số lượng đơn hàng */}
            <Col xs={24} sm={12} md={6}>
              <Card
                hoverable
                style={{
                  textAlign: "center",
                  borderRadius: 10,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#ffffff",
                }}
              >
                <Title level={4} style={{ color: "#28a745" }}>
                  {orders?.data?.length || 0}
                </Title>
                <Text>Số lượng đơn hàng</Text>
              </Card>
            </Col>

            {/* Card: Doanh thu */}
            <Col xs={24} sm={12} md={6}>
              <Card
                hoverable
                style={{
                  textAlign: "center",
                  borderRadius: 10,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#ffffff",
                }}
              >
                <Title level={4} style={{ color: "#ff6347" }}>
                  {converPrice(totalRevenue || 0)}
                </Title>
                <Text>Doanh thu</Text>
              </Card>
            </Col>

            {/* Card: Số lượng món ăn */}
            <Col xs={24} sm={12} md={6}>
              <Card
                hoverable
                style={{
                  textAlign: "center",
                  borderRadius: 10,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#ffffff",
                }}
              >
                <Title level={4} style={{ color: "#6f42c1" }}>
                  {foods?.data?.length || 0}
                </Title>
                <Text>Số lượng món ăn</Text>
              </Card>
            </Col>
          </Row>

          {/* Row: Biểu đồ và bảng */}
          <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
            <Col xs={24} md={12}>
              <Card
                title="Biểu đồ doanh thu"
                hoverable
                style={{
                  borderRadius: 10,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#ffffff",
                }}
              >
                <Radio.Group
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)} // Cập nhật trạng thái khi người dùng chọn
                  style={{ marginBottom: 16 }} // Khoảng cách bên dưới Radio Button
                >
                  <Radio.Button value="day">Theo ngày</Radio.Button>
                  <Radio.Button value="month">Theo tháng</Radio.Button>
                  <Radio.Button value="year">Theo năm</Radio.Button>
                </Radio.Group>
                <Chart
                  options={getChartData().options} // Lấy cấu hình từ lựa chọn hiện tại
                  series={getChartData().series} // Lấy dữ liệu từ lựa chọn hiện tại
                  type="bar" // Loại biểu đồ (cột)
                  height={400} // Chiều cao của biểu đồ
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                title="Bảng người dùng"
                hoverable
                style={{
                  borderRadius: 10,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#ffffff",
                }}
              >
                <TableAdminComponent
                  columns={columns}
                  isLoading={isLoadingUser}
                  pagination={{
                    position: ["bottomCenter"],
                    pageSize: 6,
                  }}
                  data={dataTable}
                />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
