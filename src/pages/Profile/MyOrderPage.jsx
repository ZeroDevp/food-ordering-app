import { QueryClient, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import * as OrderService from "../../service/OrderService";
import * as UserService from "../../service/UserService";
import Loading from "../../components/LoadingComponent/Loading";
import { useDispatch, useSelector } from "react-redux";
import customImage from "../../assets/img/logout.png";
import { LogoutOutlined, TruckOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Button, Empty, Image, List, Modal } from "antd";
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
  const [modalTextUpdate, setModalTextUpdate] = useState(
    "Vui lòng xác nhận đã nhận được hàng"
  );

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

  // const handleNavigateLogin = () => {
  //   navigate("/SignIn");
  // };

  // const handleLogout = async () => {
  //   await UserService.logoutUser();
  //   dispatch(resetUser());
  //   handleNavigateLogin();
  // };

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

  // const showLogoutModal = () => {
  //   setIsLogoutModalVisible(true);
  // };

  // const handleCancelLogout = () => {
  //   setIsLogoutModalVisible(false);
  // };

  // const confirmLogout = () => {
  //   handleLogout();
  //   setIsLogoutModalVisible(false);
  // };

  const renderFood = (data) => {
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

  // const showModal = (order) => {
  //   setCurrentOrder(order);
  //   setOpen(true);
  // };

  // const handleOk = () => {
  //   setModalText("Vui lòng xác nhận hủy đơn hàng!");
  //   setConfirmLoading(true);
  //   // handleCancelOrder(currentOrder);
  // };

  const showModalUpdate = (order) => {
    setOpenUpdate(true);
    setCurrentOrderUpdate(order);
  };

  // const handleOkUpdate = (order) => {
  //   setModalTextUpdate("Đang xác nhận đơn hàng vui lòng chờ trong giây lát !");
  //   setConfirmLoadingUpdate(true);

  //   OrderService.markOrderAsReceived(
  //     { orderId: currentOrderUpdate?._id, DaThanhToan: true, DaGiao: true },
  //     state?.token
  //   )
  //     .then(() => {
  //       QueryClient.refetchQueries(["order", state?.id]); // Làm mới dữ liệu đơn hàng
  //       setOpenUpdate(false); // Đóng modal sau khi xác nhận thành công
  //       setConfirmLoadingUpdate(false);
  //     })
  //     .catch(() => {
  //       setConfirmLoadingUpdate(false);
  //       // Có thể hiển thị một thông báo lỗi ở đây nếu cần
  //     });
  // };

  const handleOkUpdate = async () => {
    setModalTextUpdate("Đang xác nhận đơn hàng vui lòng chờ trong giây lát !");
    setConfirmLoadingUpdate(true);

    try {
      await OrderService.markOrderAsReceived(
        { orderId: currentOrderUpdate?._id, DaThanhToan: true, DaGiao: true },
        state?.token
      );

      // Làm mới dữ liệu đơn hàng
      await queryOrder.refetch();
      setOpenUpdate(false); // Đóng modal sau khi xác nhận thành công
    } catch (error) {
      console.error("Error confirming order:", error);
      // Có thể hiển thị một thông báo lỗi ở đây nếu cần
    } finally {
      setConfirmLoadingUpdate(false);
    }
  };

  const handleCancelUpdate = () => {
    setOpenUpdate(false);
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
    // <div>
    //   <div className="container pt-5" style={{ marginBottom: "100px" }}>
    //     <div className="row">
    //       <div className="col-3">
    //         <div
    //           className="card border-0 shadow"
    //           style={{
    //             borderRadius: "10px",
    //             backgroundColor: "#ff5b6a",
    //             color: "#fff",
    //           }}
    //         >
    //           <div className="text-center p-4">
    //             {AnhDaiDien ? (
    //               <Image
    //                 src={AnhDaiDien}
    //                 alt="Ảnh đại diện"
    //                 style={{
    //                   height: "136px",
    //                   width: "136px",
    //                   borderRadius: "10%",
    //                   objectFit: "cover",
    //                 }}
    //               />
    //             ) : (
    //               <p>Không có ảnh đại diện</p>
    //             )}

    //             <p
    //               style={{
    //                 marginTop: "10px",
    //                 fontWeight: "500",
    //                 fontSize: "16px",
    //               }}
    //             >
    //               {HoTen}
    //             </p>
    //           </div>
    //           <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
    //             <li style={{ padding: "10px 20px", fontSize: "1rem" }}>
    //               <Link
    //                 to="/Profile-User"
    //                 style={{ color: "#fff", textDecoration: "none" }}
    //               >
    //                 <UserOutlined /> Thông tin tài khoản
    //               </Link>
    //             </li>
    //             <li style={{ padding: "10px 20px", fontSize: "1rem" }}>
    //               <Link
    //                 style={{ color: "#fff", textDecoration: "none" }}
    //                 onClick={(e) => {
    //                   e.preventDefault();
    //                   handleClickNavigate();
    //                 }}
    //               >
    //                 <TruckOutlined /> Thông tin đơn hàng
    //               </Link>
    //             </li>
    //           </ul>
    //         </div>
    //       </div>

    //       <div className="col-lg-9 col-md-10 col-sm-12">
    //         <div
    //           className="card shadow-sm border-0"
    //           style={{
    //             borderRadius: "15px",
    //             padding: "20px",
    //             background: "linear-gradient(to bottom, #ffffff, #f9f9f9)",
    //           }}
    //         >
    //           <h2
    //             style={{
    //               fontWeight: "bold",
    //               fontSize: "1.8rem",
    //               marginBottom: "20px",
    //               textAlign: "center",
    //               color: "#34495e",
    //             }}
    //           >
    //             THÔNG TIN ĐƠN HÀNG
    //           </h2>

    //           {isLoading ? (
    //             <Loading isLoading={isLoading} />
    //           ) : Array.isArray(data) && data.length > 0 ? (
    //             data.map((order) => (
    //               <div
    //                 className="card mb-4 border-0 shadow-sm"
    //                 key={order?._id || order?.id}
    //                 style={{ borderRadius: "10px", overflow: "hidden" }}
    //               >
    //                 <div
    //                   style={{
    //                     backgroundColor: "#d5e8d4",
    //                     padding: "10px 15px",
    //                     fontWeight: "600",
    //                     display: "flex",
    //                     justifyContent: "space-between",
    //                     alignItems: "center",
    //                   }}
    //                 >
    //                   <span>Ngày đặt: {formatDate(order?.createdAt)}</span>
    //                   <span>
    //                     Thanh toán:{" "}
    //                     <strong
    //                       style={{
    //                         color: order?.DaThanhToan ? "#27ae60" : "#e74c3c",
    //                       }}
    //                     >
    //                       {order?.DaThanhToan
    //                         ? "Đã thanh toán"
    //                         : "Chưa thanh toán"}
    //                     </strong>
    //                   </span>
    //                   <span
    //                     style={{
    //                       fontSize: "14px",
    //                       color: "#c0392b",
    //                       backgroundColor: "#fce4e4",
    //                       padding: "5px 10px",
    //                       borderRadius: "5px",
    //                     }}
    //                   >
    //                     {orderContant.status[order?.TrangThaiGiaoHang]}
    //                   </span>
    //                 </div>

    //                 <div className="card-body">
    //                   <List itemLayout="horizontal">
    //                     {renderFood(order?.DonHang)}
    //                   </List>
    //                 </div>

    //                 <div
    //                   className="card-footer"
    //                   style={{
    //                     backgroundColor: "#ffffff",
    //                     display: "flex",
    //                     justifyContent: "space-between",
    //                     alignItems: "center",
    //                   }}
    //                 >
    //                   <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
    //                     Tổng tiền:{" "}
    //                     <span style={{ color: "#e74c3c" }}>
    //                       {converPrice(order?.TongTien)}
    //                     </span>
    //                   </span>
    //                   <div>
    //                     <Button
    //                       danger
    //                       onClick={() => handleCancelOrder(order)}
    //                       style={{ marginRight: "10px" }}
    //                       disabled={order?.TrangThaiGiaoHang >= 3}
    //                     >
    //                       Hủy đơn hàng
    //                     </Button>
    //                     <Button
    //                       type="primary"
    //                       onClick={() => handleDetailsOrder(order?._id)}
    //                     >
    //                       Xem chi tiết
    //                     </Button>
    //                     {order?.TrangThaiGiaoHang >= 4 && (
    //                       <Button
    //                         type="primary"
    //                         style={{
    //                           marginLeft: "10px",
    //                           backgroundColor: "#27ae60",
    //                           borderColor: "#27ae60",
    //                         }}
    //                         onClick={() => showModalUpdate(order)}
    //                         disabled={order?.DaThanhToan && order?.DaGiao}
    //                       >
    //                         Đã nhận hàng
    //                       </Button>
    //                     )}
    //                   </div>
    //                 </div>
    //               </div>
    //             ))
    //           ) : (
    //             <Empty
    //               className="mt-5"
    //               description={"Không có đơn hàng nào!"}
    //               imageStyle={{ height: 60 }}
    //               style={{ color: "#95a5a6" }}
    //             />
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div>
      <div className="container pt-5" style={{ marginBottom: "100px" }}>
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 col-md-4 col-sm-12 mb-4">
            <div
              className="card border-0 shadow"
              style={{
                borderRadius: "15px",
                backgroundColor: "#ff6b81",
                color: "#ffffff",
                overflow: "hidden",
              }}
            >
              <div className="text-center py-4">
                {AnhDaiDien ? (
                  <Image
                    src={AnhDaiDien}
                    alt="Ảnh đại diện"
                    style={{
                      height: "120px",
                      width: "120px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                ) : (
                  <p>Không có ảnh đại diện</p>
                )}
                <p
                  style={{
                    marginTop: "10px",
                    fontWeight: "600",
                    fontSize: "18px",
                  }}
                >
                  {HoTen}
                </p>
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: "0",
                  margin: "0",
                  borderTop: "1px solid #ffffff50",
                }}
              >
                <li
                  style={{
                    padding: "15px 20px",
                    fontSize: "1rem",
                    borderBottom: "1px solid #ffffff50",
                  }}
                >
                  <Link
                    to="/Profile-User"
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    <UserOutlined style={{ marginRight: "10px" }} />
                    Thông tin tài khoản
                  </Link>
                </li>
                <li style={{ padding: "15px 20px", fontSize: "1rem" }}>
                  <Link
                    style={{ color: "#fff", textDecoration: "none" }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleClickNavigate();
                    }}
                  >
                    <TruckOutlined style={{ marginRight: "10px" }} />
                    Thông tin đơn hàng
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9 col-md-8 col-sm-12">
            <div
              className="card shadow border-0"
              style={{
                borderRadius: "20px",
                padding: "25px",
                background: "#f7faff",
              }}
            >
              <h2
                style={{
                  fontWeight: "700",
                  fontSize: "2rem",
                  marginBottom: "20px",
                  textAlign: "center",
                  color: "#2f3542",
                }}
              >
                Thông tin đơn hàng
              </h2>

              {isLoading ? (
                <Loading isLoading={isLoading} />
              ) : Array.isArray(data) && data.length > 0 ? (
                data.map((order) => (
                  <div
                    className="card mb-4 shadow border-0"
                    key={order?._id || order?.id}
                    style={{
                      borderRadius: "15px",
                      overflow: "hidden",
                    }}
                  >
                    {/* Header */}
                    <div
                      className="d-flex justify-content-between align-items-center p-3"
                      style={{
                        backgroundColor: "#e3f2fd",
                        borderBottom: "1px solid #d1e9ff",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: "1rem",
                            fontWeight: "600",
                            color: "#37474f",
                          }}
                        >
                          Ngày đặt:
                        </span>{" "}
                        {formatDate(order?.createdAt)}
                      </div>
                      <div>
                        <span
                          style={{
                            fontWeight: "bold",
                            color: order?.DaThanhToan ? "#388e3c" : "#d32f2f",
                          }}
                        >
                          {order?.DaThanhToan
                            ? "Đã thanh toán"
                            : "Chưa thanh toán"}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          color: "#ffffff",
                          backgroundColor:
                            order?.TrangThaiGiaoHang === 3
                              ? "#ff9800"
                              : order?.TrangThaiGiaoHang >= 4
                              ? "#4caf50"
                              : "#f44336",
                        }}
                      >
                        {orderContant.status[order?.TrangThaiGiaoHang]}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="card-body">
                      <List itemLayout="horizontal">
                        {renderFood(order?.DonHang)}
                      </List>
                    </div>

                    {/* Footer */}
                    <div
                      className="card-footer d-flex justify-content-between align-items-center"
                      style={{
                        backgroundColor: "#ffffff",
                        padding: "15px",
                        borderTop: "1px solid #e0e0e0",
                      }}
                    >
                      <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                        Tổng tiền:{" "}
                        <span style={{ color: "#e74c3c" }}>
                          {converPrice(order?.TongTien)}
                        </span>
                      </span>
                      <div className="action-buttons">
                        <Button
                          danger
                          onClick={() => handleCancelOrder(order)}
                          style={{ marginRight: "10px" }}
                          disabled={order?.TrangThaiGiaoHang >= 3}
                        >
                          Hủy đơn hàng
                        </Button>
                        <Button
                          type="primary"
                          onClick={() => handleDetailsOrder(order?._id)}
                          style={{
                            marginRight: "10px",
                          }}
                        >
                          Chi tiết
                        </Button>
                        {order?.TrangThaiGiaoHang >= 4 && (
                          <Button
                            type="primary"
                            style={{
                              backgroundColor: "#27ae60",
                              borderColor: "#27ae60",
                            }}
                            onClick={() => showModalUpdate(order)}
                            disabled={order?.DaThanhToan && order?.DaGiao}
                          >
                            Đã nhận hàng
                          </Button>
                        )}
                        <Modal
                          title="Xác nhận đơn hàng"
                          open={openUpdate}
                          onOk={handleOkUpdate}
                          mask={false}
                          confirmLoading={confirmLoadingUpdate}
                          onCancel={handleCancelUpdate}
                        >
                          <p>{modalTextUpdate}</p>
                        </Modal>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <Empty
                  className="mt-5"
                  description={"Chưa có đơn hàng nào"}
                  imageStyle={{ height: 80 }}
                  style={{ color: "#90a4ae" }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrderPage;
