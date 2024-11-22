import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import * as OrderService from "../../service/OrderService";
import * as UserService from "../../service/UserService";
import Loading from "../../components/LoadingComponent/Loading";
import { useDispatch, useSelector } from "react-redux";
import customImage from "../../assets/img/logout.png";
import { LogoutOutlined, TruckOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Button, Image, List, Modal } from "antd";
import * as message from "../../components/Message/Message";
import { resetUser } from "../../redux/userSlide";
import { orderContant } from "../../contant";
import { converPrice } from "../../utils";
import { useMutationHooks } from "../../hook/useMutationHook";

const MyOrderPage = () => {
  const location = useLocation();
  const { state } = location;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [HoTen, setHoTen] = useState("");
  const [AnhDaiDien, setAnhDaiDien] = useState("");
  const navigate = useNavigate();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const [currentOrder, setCurrentOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const [modalText, setModalText] = useState("Vui lòng xác nhận hủy đơn hàng!");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [currentOrderUpdate, setCurrentOrderUpdate] = useState(null);
  const [confirmLoadingUpdate, setConfirmLoadingUpdate] = useState(false);

  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderbyUserId(state?.id, state?.token);
    return res.data;
  };
  const queryOrder = useQuery({
    queryKey: ["orders", state?.id],
    queryFn: fetchMyOrder,
    enabled: !!(state?.id && state?.token),
  });

  const { isLoading, data } = queryOrder;
  // console.log("data", data);
  ////////////////////////////////////

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

  const renderFood = (data) => {
    console.log("data", data);
    return data?.map((order) => {
      return (
        <List.Item key={order?._id}>
          <List.Item.Meta
            avatar={<Avatar size={80} src={order?.HinhAnh} />}
            title={
              <span
                style={{ textDecoration: "none" }}
                onClick={(e) => e.preventDefault()}
              >
                {order?.TenMonAn}
              </span>
            }
          />
          <p>{`${order?.SoLuong || 0} x ${converPrice(
            order?.GiaMonAn || 0
          )}`}</p>
        </List.Item>
      );
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const showModal = (order) => {
    setCurrentOrder(order);
    setOpen(true);
  };

  const handleOk = () => {
    setModalText("Vui lòng xác nhận hủy đơn hàng!");
    setConfirmLoading(true);
    // handleCancelOrder(currentOrder);
  };

  const showModalUpdate = (order) => {
    setOpenUpdate(true);
    setCurrentOrderUpdate(order);
  };

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token,
      },
    });
  };

  const mutation = useMutationHooks((data) => {
    const { id, token, DonHang } = data;
    const res = OrderService.cancelOrder(id, token, DonHang);
    return res;
  });

  const handleCancelOrder = (order) => {
    mutation.mutate(
      { id: order._id, token: state?.token, DonHang: order?.DonHang },
      {
        onSuccess: () => {
          queryOrder.refetch();
        },
      }
    );
  };

  const {
    isLoading: isLoadingCancel,
    isSuccess: isSuccessCancel,
    isError: isErrorCancel,
    data: dataCancel,
  } = mutation;

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === "OK") {
      message.success();
    } else if (isErrorCancel) {
      message.error();
    }
  }, [isSuccessCancel, isErrorCancel]);

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
              <h2
                style={{
                  fontWeight: "700",
                  fontSize: "1.8rem",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                THÔNG TIN ĐƠN HÀNG
              </h2>

              <Loading isLoading={isLoading} />
              {/* {data?.DonHang?.length > 0 ? ( */}
              {data?.map((order) => {
                return (
                  <div
                    className="card border-1 mt-3"
                    key={order?._id || order?.id}
                  >
                    <div
                      style={{
                        width: "100%",
                        backgroundColor: "#c3d2bd",
                        padding: "8px",
                      }}
                    >
                      Ngày đặt: <span>{formatDate(order?.createdAt)} </span> |
                      Thanh toán:{" "}
                      <span>
                        {orderContant.payment[order?.PhuongThucThanhToan]}
                      </span>
                      <span
                        style={{
                          fontSize: "16px",
                          color: "red",
                          float: "right",
                          borderRadius: "5px",
                          padding: "5px",
                          backgroundColor: "#feeeea",
                        }}
                      >
                        {orderContant.status[order?.TrangThaiGiaoHang]}
                      </span>
                    </div>

                    <div
                      className="card-body"
                      style={{ paddingTop: "10px", paddingBottom: "10px" }}
                    >
                      <List itemLayout="horizontal">
                        {renderFood(order?.DonHang)}
                      </List>
                    </div>
                    <hr style={{ marginTop: "0px" }} />
                    <div className="card-body" style={{ paddingTop: "0px" }}>
                      <span style={{ float: "right", fontSize: "18px" }}>
                        Tổng tiền:{" "}
                        <span style={{ color: "#e53637", fontWeight: "700" }}>
                          {converPrice(order?.TongTien)}
                        </span>
                      </span>
                      <div>
                        <Button
                          danger
                          onClick={() => handleCancelOrder(order)}
                          // onClick={() => showModal(order)}
                          style={{ marginRight: "10px" }}
                          disabled={order?.TrangThaiGiaoHang >= 3}
                        >
                          Hủy đơn hàng
                        </Button>
                        <Modal
                          title="Bạn có chắc muốn hủy đơn hàng?"
                          open={open}
                          mask={false}
                          onOk={handleOk}
                          confirmLoading={confirmLoading}
                          // onCancel={handleCancelOrder(order?._id)}
                        >
                          <p>{modalText}</p>
                        </Modal>
                        <Button onClick={() => handleDetailsOrder(order?._id)}>
                          Xem chi tiết
                        </Button>

                        {order?.TrangThaiGiaoHang >= 4 ? (
                          <Button
                            type="primary"
                            onClick={() => showModalUpdate(order)}
                            style={{ float: "right", marginRight: "16px" }}
                            disabled={order?.DaThanhToan && order?.DaGiao}
                          >
                            Đã nhận được hàng
                          </Button>
                        ) : null}
                        <Modal
                          title="Xác nhận đơn hàng"
                          open={openUpdate}
                          // onOk={handleOkUpdate}
                          mask={false}
                          confirmLoading={confirmLoadingUpdate}
                          // onCancel={handleCancelUpdate}
                        >
                          {/* <p>{modalTextUpdate}</p> */}
                        </Modal>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrderPage;
