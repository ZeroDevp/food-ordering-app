import React, { useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, theme, Typography } from "antd";
import SiderComponent from "../../../components/SiderComponent/SiderComponent";
import { useSelector } from "react-redux";
import * as OrderService from "../../../service/OrderService";
import { useQuery } from "@tanstack/react-query";
import VnProvinces from "vn-local-plus";
import { useNavigate } from "react-router-dom";
import { orderContant } from "../../../contant";
import { converPrice } from "../../../utils";
import TableComponent from "../../../components/TableComponent/TableComponent";
import Loading from "../../../components/LoadingComponent/Loading";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const OrderAdmin = () => {
  const user = useSelector((state) => state?.user);

  const [province, setProvince] = useState("");
  const [district, setDictrict] = useState("");
  const [ward, setWard] = useState("");
  const [rowSelected, setRowSelected] = useState(false);

  const [marginLeft, setMarginLeft] = useState(80);
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setMarginLeft(collapsed ? 280 : 80);
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder();
    return res;
  };

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrder,
  });

  const { isLoading: isLoadingOrder, data: orders } = queryOrder;

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        if (orders && orders.data && orders.data.length > 0) {
          const order = orders.data[0];
          const { ThanhPho, Huyen, Phuong } = order.DiaChiGiaoHang;

          const provinceData = await VnProvinces.getProvinces();
          const userProvince = provinceData.find(
            (prov) => prov.code === ThanhPho
          );
          setProvince(userProvince?.name || "");

          if (ThanhPho) {
            const districtData = await VnProvinces.getDistrictsByProvinceCode(
              ThanhPho
            );
            const userDistrict = districtData.find(
              (dist) => dist.code === Huyen
            );
            setDictrict(userDistrict?.name || "");
          }

          if (Huyen) {
            const wardData = await VnProvinces.getWardsByDistrictCode(Huyen);
            const userWard = wardData.find(
              (wardItem) => wardItem.code === Phuong
            );
            setWard(userWard?.name || "");
          }
        }
      } catch (error) {
        console.log("error fetching location data", error);
      }
    };

    fetchLocationData();
  }, [orders]);

  useEffect(() => {
    console.log("object", rowSelected);
  });

  const navigate = useNavigate();

  const handleClickNavigate = (id) => {
    navigate(`/system/AdminOrderDetails/${id}`);
  };

  const renderAction = (id) => {
    return (
      <Button onClick={() => handleClickNavigate(id)}>Xem chi tiết</Button>
    );
  };

  const columns = [
    {
      title: "Tên Khách Hàng",
      dataIndex: "HoTen",
    },
    {
      title: "Số điện thoại",
      dataIndex: "DienThoai",
    },

    {
      title: "Trạng Thái Thanh Toán",
      dataIndex: "DaThanhToan",
    },
    {
      title: "Trạng Thái Giao Hàng",
      dataIndex: "TrangThaiGiaoHang",
    },
    {
      title: "Phương Thức Thanh Toán",
      dataIndex: "PhuongThucThanhToan",
    },
    {
      title: "Tổng tiền",
      dataIndex: "TongTien",
    },
    {
      title: "Chức năng",
      dataIndex: "Action",
      render: (_, record) => renderAction(record.key),
    },
  ];

  const dataTable = orders?.data?.map((order) => ({
    key: order._id,
    HoTen: order?.DiaChiGiaoHang?.HoTen,
    DienThoai: order?.DiaChiGiaoHang?.DienThoai,
    Diachi: `${order.DiaChiGiaoHang.Diachi}, ${district}, ${ward}, ${province}`,
    DaThanhToan: order?.DaThanhToan ? "Đã thanh toán" : "Chưa Thanh toán",
    TrangThaiGiaoHang: order?.DaGiao ? "Đã Giao" : "Chưa giao",
    PhuongThucThanhToan: orderContant.payment[order?.PhuongThucThanhToan],
    TongTien: converPrice(order?.TongTien),
  }));

  return (
    <Loading isLoading={isLoadingOrder}>
      <Layout style={{ minHeight: "100vh", backgroundColor: "#FFF7E4" }}>
        <SiderComponent collapsed={collapsed} user={user} selectKey={"4"} />
        <Layout
          style={{
            minHeight: "750px",
            marginLeft: marginLeft,
            transition: "margin-left 0.3s ease",
            backgroundColor: "#FFF7E4",
          }}
        >
          <Header
            style={{
              padding: "0 16px",
              background: "#fff",
              justifyContent: "space-between",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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
            <Text strong style={{ marginLeft: 20, fontSize: 22 }}>
              QUẢN LÝ ĐƠN HÀNG
            </Text>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <TableComponent
              columns={columns}
              isLoading={isLoadingOrder}
              data={dataTable}
              pagination={{
                pageSize: 8,
                position: ["bottomCenter"], // Đặt nút phân trang ở giữa
              }}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    setRowSelected(record._id);
                  },
                };
              }}
            />
          </Content>
        </Layout>
      </Layout>
    </Loading>
  );
};

export default OrderAdmin;
