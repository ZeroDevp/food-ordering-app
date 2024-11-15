import { Checkbox } from "antd";
import React, { useState } from "react";
import {
  Image,
  Button,
  Card,
  Row,
  Col,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { converPrice } from "../../utils";
import {
  decreaseSoLuong,
  increaseSoLuong,
  removeAllOrderFood,
  removeOrderFood,
} from "../../redux/slide/orderSlide";
import "./Cart.css";

const OrderPage = () => {
  const order = useSelector((state) => state.order);
  const [listChecked, setListChecked] = useState([]);
  const dispatch = useDispatch();

  const handleChangeCount = (LoaiMonAn, idFood) => {
    if (LoaiMonAn === "increase") {
      dispatch(increaseSoLuong({ idFood }));
    } else {
      dispatch(decreaseSoLuong({ idFood }));
    }
  };

  const handleDeleteOrder = (idFood) => {
    dispatch(removeOrderFood({ idFood }));
  };

  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = [];
      order?.DonHang?.forEach((item) => {
        newListChecked.push(item?.food);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== e.target.value
      );
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  const handleRemoveAllOrder = () => {
    if (listChecked?.length > 1) {
      dispatch(removeAllOrderFood({ listChecked }));
    }
  };

  return (
    <div className="p-4 bg-light">
      <h4 className="mb-4">Giỏ hàng</h4>

      <Row>
        <Col xs={12} md={8}>
          <div className="d-flex align-items-center justify-content-between p-3 bg-light border-bottom">
            <span
              className="d-inline-flex align-items-center"
              style={{ width: "390px" }}
            >
              <Checkbox
                onChange={handleOnchangeCheckAll}
                checked={listChecked?.length === order?.DonHang?.length}
              ></Checkbox>
              <span className="ms-2">
                Tất cả ({order?.DonHang?.length} món ăn)
              </span>
            </span>
            <span className="text-center flex-grow-1">Đơn giá</span>
            <span className="text-center flex-grow-1">Số lượng</span>
            <span className="text-center flex-grow-1">Thành tiền</span>
            <FaTrash
              style={{ cursor: "pointer" }}
              onClick={handleRemoveAllOrder}
            />
          </div>

          {order?.DonHang?.length === 0 ? (
            <div
              className="text-center p-3"
              style={{
                fontSize: "large",
                marginTop: "80px",
                color: "#ccc",
                fontStyle: "italic",
              }}
            >
              Bạn chưa có món ăn nào trong giỏ hàng
            </div>
          ) : (
            order.DonHang.map((order, index) => {
              return (
                <div
                  className="d-flex align-items-center justify-content-between p-3 mt-2 bg-white border rounded"
                  style={{ width: "100%" }}
                  key={order.id || index} // Nếu order có thuộc tính id, hãy thêm key để tối ưu hóa
                >
                  <span
                  // className="text-center flex-grow-1"
                  >
                    <Checkbox
                      onChange={onChange}
                      value={order?.food}
                      checked={listChecked.includes(order?.food)}
                    ></Checkbox>
                    <Image
                      src={order?.HinhAnh}
                      alt="product"
                      rounded
                      style={{
                        width: "100px",
                        marginLeft: "10px",
                      }}
                    />
                  </span>
                  <span
                    className="d-flex align-items-center"
                    style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      width: "260px",
                      marginLeft: "10px",
                    }}
                  >
                    {order?.TenMonAn}
                  </span>
                  <span className="text-center flex-grow-1">
                    {converPrice(order?.GiaMonAn)}
                  </span>
                  <span className="text-center flex-grow-1 d-flex align-items-center">
                    <InputGroup
                      className="quantity-control"
                      style={{ justifyContent: "center" }}
                    >
                      <Button
                        variant="outline-secondary"
                        onClick={() =>
                          handleChangeCount("decrease", order?.food)
                        }
                      >
                        -
                      </Button>
                      <FormControl
                        type="input"
                        value={order?.SoLuong}
                        disabled
                        className="text-center"
                        style={{ maxWidth: "60px" }}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() =>
                          handleChangeCount("increase", order?.food)
                        }
                      >
                        +
                      </Button>
                    </InputGroup>
                  </span>
                  <span className="text-center flex-grow-1 text-danger">
                    {converPrice(order?.GiaMonAn * order?.SoLuong)}
                  </span>
                  <FaTrash
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => handleDeleteOrder(order?.food)}
                  />
                </div>
              );
            })
          )}
        </Col>

        <Col xs={12} md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Tạm tính</span>
                <span>0</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Giảm giá</span>
                <span>0</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Thuế</span>
                <span>0</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Phí giao hàng</span>
                <span>0</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <strong>Tổng tiền</strong>
                <strong className="text-danger">0213</strong>
              </div>
              <small className="text-muted d-block mb-2">
                (Đã bao gồm VAT nếu có)
              </small>
              <Button
                style={{
                  background: "#ff5b6a",
                  border: "1px solid #ff5b6a",
                  fontSize: "20px",
                }}
                className="w-100"
              >
                Mua hàng
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderPage;
