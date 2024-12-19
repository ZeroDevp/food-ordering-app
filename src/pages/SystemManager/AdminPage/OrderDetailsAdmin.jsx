import React, { useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Content, Header } from "antd/es/layout/layout";
import Loading from "../../../components/LoadingComponent/Loading";
import {
  Button,
  Col,
  Image,
  Layout,
  message,
  Row,
  Select,
  Table,
  theme,
  Typography,
} from "antd";
import SiderComponent from "../../../components/SiderComponent/SiderComponent";
import { useSelector } from "react-redux";
import { converPrice, formatDate } from "../../../utils";
import { useParams } from "react-router-dom";
import * as OrderService from "../../../service/OrderService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import VnProvinces from "vn-local-plus";
import { useMutationHooks } from "../../../hook/useMutationHook";
import { orderContant } from "../../../contant";

const { Title, Text } = Typography;

const OrderDetailsAdmin = () => {
  const user = useSelector((state) => state?.user);
  const { id } = useParams();
  const [marginLeft, setMarginLeft] = useState(80);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const queryClient = useQueryClient();

  const fetchGetDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id);
    return res.data;
  };
  const queryOrder = useQuery({
    queryKey: ["product-details", id],
    queryFn: fetchGetDetailsOrder,
    enabled: !!id,
  });
  const { isLoading, data: orderDetails } = queryOrder;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setMarginLeft(collapsed ? 280 : 80);
  };

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        if (orderDetails) {
          const { ThanhPho, Huyen, Phuong } = orderDetails.DiaChiGiaoHang;

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
            setDistrict(userDistrict?.name || "");
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
        console.error("Error fetching location data:", error);
      }
    };

    fetchLocationData();
  }, [orderDetails]);

  const dataSource = orderDetails?.DonHang.map((item, index) => ({
    key: index + 1,
    HinhAnh: item.HinhAnh,
    TenMonAn: item.TenMonAn,
    GiaMonAn: converPrice(item.GiaMonAn),
    SoLuong: item.SoLuong,
    // total: converPrice(item.price * item.amount),
    TongTien: converPrice(item.GiaMonAn * item.SoLuong),
  }));

  const columns = [
    {
      title: "Hình Ảnh",
      dataIndex: "HinhAnh",
      key: "HinhAnh",
      render: (text) => <Image width={60} src={text} />,
    },
    {
      title: "Tên Món Ăn",
      dataIndex: "TenMonAn",
      key: "TenMonAn",
    },
    {
      title: "Giá Món Ăn",
      dataIndex: "GiaMonAn",
      key: "GiaMonAn",
    },
    {
      title: "Số Lượng",
      dataIndex: "SoLuong",
      key: "SoLuong",
    },
    {
      title: "Thành Tiền",
      dataIndex: "TongTien",
      key: "TongTien",
    },
  ];

  const mutationUpdate = useMutationHooks(({ orderId, status }) => {
    const res = OrderService.updateOrderStatus(
      { orderId, status },
      user.access_token
    );
    return res;
  });

  const { isSuccess: isSuccessUpdated, isError: isErrorUpdated } =
    mutationUpdate;

  useEffect(() => {
    if (isSuccessUpdated) {
      message.success("Cập nhật thành công trạng thái đơn hàng!");
      queryClient.invalidateQueries(["product-details", id]);
    } else if (isErrorUpdated) {
      message.error("Cập nhật thất bại trạng thái đơn hàng!");
    }
  }, [isSuccessUpdated, isErrorUpdated, queryClient, id]);

  const handleStatusChange = (value) => {
    mutationUpdate.mutate({ orderId: id, status: value });
  };

  const Delivery = () => {
    if (orderDetails?.GiaVanChuyen === 10000) {
      return (
        <>
          <span style={{ fontWeight: 700, color: "#ff7b02" }}>FAST</span> Giao
          hàng tiết kiệm
        </>
      );
    } else if (orderDetails?.GiaVanChuyen === 20000) {
      return (
        <>
          {" "}
          <span style={{ fontWeight: 700, color: "#ff7b02" }}>
            Grab_Food
          </span>{" "}
          Giao hàng tiết kiệm
        </>
      );
    } else {
      return (
        <>
          {" "}
          <span style={{ fontWeight: 700, color: "#ff7b02" }}>
            Shopee_Food
          </span>{" "}
          Giao hàng tiết kiệm
        </>
      );
    }
  };

  return (
    <Loading isLoading={isLoading}>
      <Layout style={{ minHeight: "100vh", backgroundColor: "#FEE4CC" }}>
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
              padding: "20px",
              minHeight: "280px",
              background: "#f8f9fa",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Tiêu đề đơn hàng */}
            <div
              style={{
                padding: "15px 20px",
                backgroundColor: "#fff",
                borderRadius: "10px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3
                style={{ fontWeight: "600", fontSize: "1.5rem", color: "#333" }}
              >
                Thông tin đơn hàng
              </h3>
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    fontSize: "16px",
                    color: "#555",
                    marginRight: "10px",
                    fontWeight: "500",
                  }}
                >
                  Mã đơn: {orderDetails?._id}
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#fff",
                    backgroundColor:
                      orderDetails?.TrangThaiGiaoHang >= 4
                        ? "#28a745"
                        : "#ffc107",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    fontWeight: "600",
                  }}
                >
                  {orderContant.status[orderDetails?.TrangThaiGiaoHang]}
                </span>
              </div>
            </div>

            {/* Thông tin khách hàng và vận chuyển */}
            <Row gutter={24}>
              <Col span={12}>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "10px",
                    padding: "20px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <h4 style={{ fontWeight: "600", marginBottom: "15px" }}>
                    Thông tin khách hàng
                  </h4>
                  <p style={{ margin: 0 }}>
                    <strong>Họ và tên:</strong>{" "}
                    {orderDetails?.DiaChiGiaoHang?.HoTen}
                  </p>
                  <p style={{ margin: "10px 0" }}>
                    <strong>Địa chỉ:</strong>{" "}
                    {`${orderDetails?.DiaChiGiaoHang?.Diachi}, ${ward}, ${district}, ${province}`}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong> 0
                    {orderDetails?.DiaChiGiaoHang?.DienThoai}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "10px",
                    padding: "20px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <h4 style={{ fontWeight: "600", marginBottom: "15px" }}>
                    Thông tin thanh toán & vận chuyển
                  </h4>
                  <p style={{ margin: 0 }}>
                    <strong>Phương thức thanh toán:</strong>{" "}
                    {orderContant.payment[orderDetails?.PhuongThucThanhToan]}
                  </p>
                  <p style={{ margin: "10px 0" }}>
                    <strong>Phương thức vận chuyển:</strong> {Delivery()}
                  </p>
                  <p>
                    <strong>Ngày đặt hàng:</strong>{" "}
                    {formatDate(orderDetails?.createdAt)}
                  </p>
                </div>
              </Col>
            </Row>

            {/* Trạng thái đơn hàng */}
            <div
              style={{
                background: "#fff",
                borderRadius: "10px",
                padding: "20px",
                marginTop: "20px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h4 style={{ fontWeight: "600", marginBottom: "15px" }}>
                Thay đổi trạng thái đơn hàng
              </h4>
              <Select
                defaultValue={orderDetails?.TrangThaiGiaoHang || "1"}
                style={{ width: "100%" }}
                options={[
                  { value: "1", label: "Chờ xác nhận" },
                  { value: "2", label: "Đã xác nhận" },
                  { value: "3", label: "Đang vận chuyển" },
                  { value: "4", label: "Đã giao hàng" },
                ]}
                onChange={handleStatusChange}
              />
            </div>

            {/* Thông tin sản phẩm */}
            <div
              style={{
                background: "#fff",
                borderRadius: "10px",
                padding: "20px",
                marginTop: "20px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h4 style={{ fontWeight: "600", marginBottom: "15px" }}>
                Thông tin sản phẩm
              </h4>
              <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                style={{ marginBottom: "20px" }}
              />
              <div style={{ textAlign: "right", fontSize: "16px" }}>
                <strong>Tổng tiền:</strong>{" "}
                <span style={{ color: "#e74c3c", fontWeight: "700" }}>
                  {converPrice(orderDetails?.TongTien)}
                </span>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Loading>
  );
};

export default OrderDetailsAdmin;
