import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import * as OrderService from "../../service/OrderService";
import * as UserService from "../../service/UserService";
// import Loading from "../../components/LoadingComponent/Loading";
import { useDispatch, useSelector } from "react-redux";
import customImage from "../../assets/img/logout.png";
import { LogoutOutlined, TruckOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Image, Modal } from "antd";
import { resetUser } from "../../redux/userSlide";
import VnProvinces from "vn-local-plus";
import { orderContant } from "../../contant";
import { converPrice } from "../../utils";

const DetailsOrderPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [HoTen, setHoTen] = useState("");
  const [AnhDaiDien, setAnhDaiDien] = useState("");
  const navigate = useNavigate();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const params = useParams();
  const location = useLocation();
  const { state } = location;
  const { id } = params;
  const [provinceName, setProvinceName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state?.token);
    return res.data;
  };

  const queryOrder = useQuery({
    queryKey: ["order-details"],
    queryFn: fetchDetailsOrder,
    enabled: !!id,
  });

  const { data } = queryOrder;
  // console.log("data", data);

  useEffect(() => {
    if (data?.DiaChiGiaoHang) {
      const { ThanhPho, Huyen, Phuong } = data.DiaChiGiaoHang;

      const fetchLocationData = async () => {
        const province = VnProvinces.getProvinceByCode(ThanhPho);
        setProvinceName(province?.name || "");

        const districtData = VnProvinces.getDistrictByCode(Huyen);
        setDistrictName(districtData?.name || "");

        const wardData = VnProvinces.getWardByCode(Phuong);
        setWardName(wardData?.name || "");
      };

      fetchLocationData();
    }
  }, [data]);

  const handleNavigateLogin = () => {
    navigate("/SignIn");
  };

  const handleLogout = async () => {
    await UserService.logoutUser();
    dispatch(resetUser());
    handleNavigateLogin();
  };

  useEffect(() => {
    setHoTen(user?.HoTen);
    setAnhDaiDien(user?.AnhDaiDien);
  }, [user]);

  const handleClickNavigate = () => {
    navigate("/my-order", {
      state: {
        id: user?.id,
        token: user?.access_token,
      },
    });
  };

  const showLogoutModal = () => {
    setIsLogoutModalVisible(true);
  };

  const handleCancelLogout = () => {
    setIsLogoutModalVisible(false);
  };

  const confirmLogout = () => {
    handleLogout();
    setIsLogoutModalVisible(false);
  };

  //Tạm tính
  const priceMemo = useMemo(() => {
    const result = data?.DonHang?.reduce((total, cur) => {
      return total + cur.GiaMonAn * cur.SoLuong;
    }, 0);
    return result;
  }, [data]);

  return (
    <div>
      <div className="container pt-5" style={{ marginBottom: "100px" }}>
        <div className="row">
          <div className="col-3">
            <div
              className="card border-0 shadow"
              style={{
                borderRadius: "10px",
                backgroundColor: "#ff5b6a",
                color: "#fff",
              }}
            >
              <div className="text-center p-4">
                {AnhDaiDien ? (
                  <Image
                    src={AnhDaiDien}
                    alt="Ảnh đại diện"
                    style={{
                      height: "136px",
                      width: "136px",
                      borderRadius: "10%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <p>Không có ảnh đại diện</p>
                )}

                <p
                  style={{
                    marginTop: "10px",
                    fontWeight: "500",
                    fontSize: "16px",
                  }}
                >
                  {HoTen}
                </p>
              </div>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                <li style={{ padding: "10px 20px", fontSize: "1rem" }}>
                  <Link
                    to="/Profile-User"
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    <UserOutlined /> Thông tin tài khoản
                  </Link>
                </li>
                <li style={{ padding: "10px 20px", fontSize: "1rem" }}>
                  <Link
                    style={{ color: "#fff", textDecoration: "none" }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleClickNavigate();
                    }}
                  >
                    <TruckOutlined /> Thông tin đơn hàng
                  </Link>
                </li>
                <li style={{ padding: "10px 20px", fontSize: "1rem" }}>
                  <Link
                    style={{ color: "#fff", textDecoration: "none" }}
                    onClick={showLogoutModal}
                  >
                    <LogoutOutlined /> Đăng xuất
                  </Link>
                  <Modal
                    open={isLogoutModalVisible}
                    onOk={confirmLogout}
                    onCancel={handleCancelLogout}
                    footer={null}
                    centered
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      borderRadius: "10px",
                    }}
                    wrapClassName="custom-logout-modal"
                  >
                    <img
                      src={customImage}
                      alt="Custom Icon"
                      style={{ width: "400px", marginBottom: "0px" }}
                    />
                    <div style={{ marginTop: "20px" }}>
                      <p style={{ fontSize: "18px", marginBottom: "20px" }}>
                        Bạn muốn đăng xuất?
                      </p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "10px",
                        }}
                      >
                        <Button
                          onClick={handleCancelLogout}
                          style={{
                            backgroundColor: "#f2f2f2",
                            borderColor: "#f2f2f2",
                            color: "#ff6666",
                          }}
                        >
                          Hủy
                        </Button>
                        <Button
                          onClick={handleLogout}
                          style={{
                            backgroundColor: "#ff6666",
                            borderColor: "#ff6666",
                            color: "#fff",
                          }}
                        >
                          OK
                        </Button>
                      </div>
                    </div>
                  </Modal>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-9">
            <div
              className="card border-0 shadow"
              style={{
                borderRadius: "10px",
                padding: "20px",
                background: "#f2f2f2",
              }}
            >
              {/* <h2
                style={{
                  fontWeight: "700",
                  fontSize: "1.8rem",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                CHI TIẾT ĐƠN HÀNG
              </h2> */}
              {/* Địa chỉ người nhận */}
              <div
                style={{
                  marginBottom: "20px",
                  padding: "15px",
                  background: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h4 style={{ fontWeight: "600", marginBottom: "10px" }}>
                  Địa chỉ người nhận
                </h4>
                <p>
                  <b>Họ tên:</b> {data?.DiaChiGiaoHang?.HoTen}
                </p>
                <p>
                  <b>Số điện thoại:</b> {data?.DiaChiGiaoHang?.DienThoai}
                </p>
                <p>
                  <b>Địa chỉ:</b> {data?.DiaChiGiaoHang?.Diachi}, {wardName},{" "}
                  {districtName}, {provinceName}
                </p>
                {/* <p>
                  <b>Hình thức vận chuyển:</b> FAST
                </p> */}
                <p>
                  <b>Phương thức thanh toán:</b> {data?.PhuongThucThanhToan} |{" "}
                  {data?.DaThanhToan ? "Đã thanh toán" : "Chưa thanh toán"}
                </p>
                <p>
                  <b>Phí vận chuyển:</b> {converPrice(data?.GiaVanChuyen)}
                </p>
              </div>

              {/* Sản phẩm */}
              <div
                style={{
                  padding: "15px",
                  background: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h4 style={{ fontWeight: "600", marginBottom: "10px" }}>
                  Món ăn
                </h4>
                <div>
                  {/* Danh sách sản phẩm */}
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {data?.DonHang?.map((order) => {
                      return (
                        <li
                          key={order?.id || order?._id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "15px",
                            borderBottom: "1px solid #ddd",
                            paddingBottom: "10px",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <img
                              src={order?.HinhAnh}
                              alt="Sản phẩm"
                              style={{
                                width: "80px",
                                height: "80px",
                                marginRight: "15px",
                                borderRadius: "8px",
                                objectFit: "cover",
                              }}
                            />
                            <div>
                              <h5 style={{ margin: 0 }}>{order?.TenMonAn}</h5>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: "14px",
                                  color: "#555",
                                }}
                              >
                                Số lượng: {order?.SoLuong}
                              </p>
                            </div>
                          </div>
                          <div>
                            {/* <p
                              style={{
                                margin: 0,
                                fontWeight: "bold",
                                color: "#333",
                              }}
                            >
                              -{" "}
                              {data?.GiamGia
                                ? converPrice(data?.GiamGia)
                                : "0 VNĐ"}
                            </p> */}
                          </div>
                          <div>
                            <p
                              style={{
                                margin: 0,
                                fontWeight: "bold",
                                color: "#333",
                              }}
                            >
                              {converPrice(order?.GiaMonAn)}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="col-lg-6">
                  <div className="card border-1 mt-3">
                    <div className="card-body">
                      <h5 style={{ paddingBottom: "10px" }}>
                        Tóm tắt tổng tiền
                      </h5>
                      <div>
                        <ul className="checkout__total__all">
                          <li>
                            <b>Tạm tính: </b>{" "}
                            <span>{converPrice(priceMemo)}</span>
                          </li>
                          <li>
                            <b>Phí vận chuyển: </b>
                            <span>{converPrice(data?.GiaVanChuyen)}</span>
                          </li>

                          <li>
                            <b>Giảm giá: </b>
                            <span>
                              {data?.DonHang?.[0]?.GiamGia
                                ? converPrice(
                                    (priceMemo * data?.DonHang?.[0]?.GiamGia) /
                                      100
                                  )
                                : "0 VNĐ"}
                            </span>
                          </li>
                        </ul>
                        <span>
                          <b> Tổng tiền: </b>
                          <span
                            style={{
                              float: "right",
                              color: "#e53637",
                              fontWeight: "700",
                            }}
                          >
                            {converPrice(data?.TongTien)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsOrderPage;
