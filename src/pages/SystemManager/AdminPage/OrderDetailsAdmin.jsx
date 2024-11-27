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

const OrderDetailsAdmin = () => {
  const user = useSelector((state) => state?.user);
  const { id } = useParams();
  const [marginLeft, setMarginLeft] = useState(80);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const queryClient = useQueryClient();

  const fetchGetDetailsProduct = async () => {
    const res = await OrderService.getDetailsOrder(id);
    return res.data;
  };
  const queryOrder = useQuery({
    queryKey: ["product-details", id],
    queryFn: fetchGetDetailsProduct,
    enabled: !!id,
  });
  const { isLoading, data: orderDetails } = queryOrder;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setMarginLeft(collapsed ? 200 : 80);
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

  //   useEffect(() => {
  //     const fetchLocationData = async () => {
  //       try {
  //         if (orderDetails && orderDetails.data && orderDetails.data.length > 0) {
  //           const order = orderDetails.data[0];
  //           const { ThanhPho, Huyen, Phuong } = order.DiaChiGiaoHang;

  //           const provinceData = await VnProvinces.getProvinces();
  //           const userProvince = provinceData.find(
  //             (prov) => prov.code === ThanhPho
  //           );
  //           setProvince(userProvince?.name || "");

  //           if (ThanhPho) {
  //             const districtData = await VnProvinces.getDistrictsByProvinceCode(
  //               ThanhPho
  //             );
  //             const userDistrict = districtData.find(
  //               (dist) => dist.code === Huyen
  //             );
  //             setDistrict(userDistrict?.name || "");
  //           }

  //           if (Huyen) {
  //             const wardData = await VnProvinces.getWardsByDistrictCode(Huyen);
  //             const userWard = wardData.find(
  //               (wardItem) => wardItem.code === Phuong
  //             );
  //             setWard(userWard?.name || "");
  //           }
  //         }
  //       } catch (error) {
  //         console.log("error fetching location data", error);
  //       }
  //     };

  //     fetchLocationData();
  //   }, [orderDetails]);

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
              QUẢN LÝ ĐƠN HÀNG
            </h5>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Row>
              <Col span={8}>
                <h3>Thông tin đơn hàng</h3>
              </Col>
              <Col span={8} offset={8} style={{ textAlign: "right" }}>
                <span style={{ fontSize: "18px" }}>{orderDetails?._id}</span>{" "}
                <span
                  style={{
                    fontSize: "18px",
                    color: "red",
                    borderRadius: "5px",
                    padding: "5px",
                    backgroundColor: "#feeeea",
                  }}
                >
                  {orderContant.status[orderDetails?.TrangThaiGiaoHang]}
                </span>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <h5>Thông tin khách hàng</h5>
                <h5 className="mt-3" style={{ textTransform: "capitalize" }}>
                  Họ và tên: {orderDetails?.DiaChiGiaoHang?.HoTen}
                </h5>
                <div className="mt-3">
                  Địa chỉ:{" "}
                  {`${orderDetails?.DiaChiGiaoHang.Diachi} , ${ward}, ${district}, ${province}`}
                </div>
                <div className="mt-3">
                  Số điện thoại: 0{orderDetails?.DiaChiGiaoHang?.DienThoai}
                </div>
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                <h5>Phương thức thanh toán</h5>
                <div className="mt-3">
                  {orderContant.payment[orderDetails?.PhuongThucThanhToan]}
                </div>
                <h5 className="mt-3">Phương thức vận chuyển</h5>
                <div className="mt-3"> {Delivery()}</div>
                <h5 className="mt-3">Ngày đặt hàng</h5>
                <div className="mt-3">
                  {formatDate(orderDetails?.createdAt)}
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <h4>Thay đổi trạng thái đơn hàng</h4>
                <Select
                  className="mt-3"
                  defaultValue={orderDetails?.TrangThaiGiaoHang || "1"}
                  style={{ width: 306 }}
                  options={[
                    { value: "1", label: "Chờ xác nhận" },
                    { value: "2", label: "Đã xác nhận" },
                    { value: "3", label: "Đang vận chuyển" },
                    { value: "4", label: "Đã giao hàng" },
                  ]}
                  onChange={handleStatusChange}
                />
              </Col>
            </Row>

            <Row>
              <Col className="mt-3" span={24} style={{}}>
                <span style={{ fontSize: "18px", fontWeight: "400" }}>
                  Thông tin sản phẩm
                </span>
                <span style={{ float: "right" }}>
                  {orderDetails?.DonHang?.length} sản phẩm
                </span>
              </Col>
              <Col span={24}>
                <Table
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                  className="mt-3"
                  bordered
                  dataSource={dataSource}
                  columns={columns}
                  pagination={false}
                />
                <Col className="mt-3" span={12} offset={18}>
                  <span style={{ fontSize: "16px", color: "#111111" }}>
                    Tổng tiền:{" "}
                    <span
                      style={{
                        color: "#e53637",
                        fontWeight: "700",
                      }}
                    >
                      {converPrice(orderDetails?.TongTien)}
                    </span>
                  </span>
                </Col>
                <hr />
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </Loading>
  );
};

export default OrderDetailsAdmin;
