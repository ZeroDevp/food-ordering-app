import { Image } from "antd";
import React from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { converPrice } from "../../utils";
import "../Orderpage/Cart.css";
import { useLocation, useNavigate } from "react-router-dom";
import { orderContant } from "../../contant";
// import Loading from "../../components/LoadingComponent/Loading";

const OrderSuccess = () => {
  const order = useSelector((state) => state.order);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  return (
    <div className="p-4 bg-light">
      <div
        style={{
          background: "#FF5B6A",
          height: "50px",
          marginBottom: "10px",
          borderRadius: "10px",
        }}
        className="d-flex justify-content-center"
      >
        <h4
          className=" mb-4 "
          style={{
            marginTop: "12px",
            color: "#fff",
            textTransform: "uppercase",
          }}
        >
          Món ăn đã được đặt thành công
        </h4>
      </div>
      <Row>
        <Col xs={12} md={12}>
          <Card
            className="border-0 shadow-sm"
            style={{ background: "#f9f9f9" }}
          >
            <Card.Body>
              {/* Phương thức giao hàng */}
              {/* <div className="user-info mb-4">
                <h5 className="mb-3" style={{ fontWeight: "600" }}>
                  Phương thức giao hàng
                </h5>
                <Row>
                  <Col xs={12} sm={12} className="mb-3">
                    <div
                      style={{
                        border: "1px solid #cccc",
                        borderRadius: "10px",
                        height: "120px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#ffffff",
                        //   cursor: "pointer",
                        transition: "all 0.3s ease-in-out",
                      }}
                      className="delivery-method "
                    >
                      <label
                        htmlFor="fast"
                        className="d-flex align-items-center"
                        style={{ fontSize: "16px" }}
                      >
                        <span
                          style={{
                            fontWeight: 700,
                            color: "#ff7b02",
                            marginRight: "10px",
                          }}
                        >
                          {orderContant.delivery[state?.delivery]}
                        </span>
                        Giao hàng tiết kiệm
                      </label>
                    </div>
                  </Col>
                </Row>
              </div>

              <hr /> */}

              {/* Phương thức thanh toán */}
              <div className="user-info">
                <h5 className="mb-3" style={{ fontWeight: "600" }}>
                  Phương thức thanh toán
                </h5>
                <Row>
                  <Col xs={12} sm={12} className="mb-3">
                    <div
                      style={{
                        border: "1px solid #cccc",
                        borderRadius: "10px",
                        height: "120px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#ffffff",
                        //   cursor: "pointer",
                        transition: "all 0.3s ease-in-out",
                      }}
                      className="payment-method "
                    >
                      <label
                        htmlFor="paymentincash"
                        className="d-flex align-items-center"
                        style={{ fontSize: "16px" }}
                      >
                        <span style={{ marginLeft: "5px" }}>
                          {orderContant.payment[state?.payment]}
                        </span>
                      </label>
                    </div>
                  </Col>
                </Row>
              </div>
              <hr />
              <div
                style={{ fontWeight: "600" }}
                className="d-flex align-items-center justify-content-between p-3 bg-light border-bottom flex-wrap"
              >
                {/* Header */}
                <span
                  className="d-inline-flex align-items-center text-truncate"
                  style={{ width: "390px", flex: "2", minWidth: "200px" }}
                >
                  <span className="ms-2">Món ăn</span>
                </span>
                <span
                  className="text-center flex-grow-1 d-none d-md-inline"
                  style={{ minWidth: "120px" }}
                >
                  Đơn giá
                </span>
                <span
                  className="text-center flex-grow-1 d-none d-md-inline"
                  style={{ minWidth: "120px" }}
                >
                  Số lượng
                </span>
              </div>

              {/* Danh sách món ăn */}
              <div className="order-list">
                {state.orders?.map((order, index) => (
                  <div
                    className="d-flex align-items-center justify-content-between p-3 mt-2 bg-white border rounded flex-wrap order-item"
                    key={order.id || index}
                  >
                    <span
                      className="d-flex align-items-center text-truncate"
                      style={{
                        width: "390px",
                        flex: "2",
                        minWidth: "200px",
                      }}
                    >
                      <img
                        src={order?.HinhAnh}
                        alt="product"
                        className="rounded"
                        style={{
                          width: "80px",
                          height: "80px",
                          marginLeft: "10px",
                          objectFit: "cover",
                        }}
                      />
                      <span
                        className="ms-2 text-truncate"
                        style={{
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          marginLeft: "10px",
                        }}
                      >
                        {order?.TenMonAn}
                      </span>
                    </span>
                    <span
                      className="text-center flex-grow-1 text-danger d-none d-md-inline"
                      style={{ minWidth: "120px" }}
                    >
                      {converPrice(order?.GiaMonAn)}
                    </span>
                    <span
                      className="text-center flex-grow-1 d-none d-md-inline"
                      style={{ minWidth: "120px" }}
                    >
                      {order?.SoLuong}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tổng giá */}
              <div
                className="d-flex justify-content-end align-items-center mt-4 p-3 bg-light border-top"
                style={{ fontWeight: "500", fontSize: "18px" }}
              >
                <span style={{ marginRight: "10px" }}>Tổng cộng:</span>
                <span
                  style={{
                    color: "#ff5b6a",
                    fontWeight: "600",
                    fontSize: "20px",
                  }}
                >
                  {converPrice(state?.priceMemo)}
                </span>
              </div>

              {/* Back to shop food */}
              <div className="user-info">
                <Row>
                  <Col xs={12} sm={12} className="mb-3">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between", // Căn giữa cả hai nút
                        gap: "20px", // Khoảng cách giữa các nút
                        width: "100%",
                      }}
                      className="payment-method "
                    >
                      <Button
                        onClick={() => navigate("/Product")}
                        style={{
                          background: "#ff5b6a",
                          border: "1px solid #ff5b6a",
                          fontSize: "18px",
                          fontWeight: "500",
                        }}
                        className="w-100 btn-order"
                      >
                        Tiếp tục mua
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderSuccess;
