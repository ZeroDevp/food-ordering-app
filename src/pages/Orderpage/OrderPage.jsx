import { Checkbox, Form, Select } from "antd";
import React, { useEffect, useMemo, useState } from "react";
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
  selectedOrder,
} from "../../redux/slide/orderSlide";
import "./Cart.css";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import {
  getProvinces,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode,
} from "vn-local-plus";
import { useMutationHooks } from "../../hook/useMutationHook";
import * as UserService from "../../service/UserService";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/userSlide";
import VnProvinces from "vn-local-plus";
import { useNavigate } from "react-router-dom";
import StepComponent from "../../components/StepComponent/StepComponent";

const OrderPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [listChecked, setListChecked] = useState([]);
  const dispatch = useDispatch();
  const [isOpenModalInfo, setIsOpenModalInfo] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const inittial = () => ({
    HoTen: "",
    Diachi: "",
    DienThoai: "",
    Huyen: "",
    Phuong: "",
    ThanhPho: "",
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [stateUserDetails, setStateUserDetails] = useState(inittial());

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const provinceData = VnProvinces.getProvinces();
        const userProvince = provinceData.find(
          (prov) => prov.code === user.ThanhPho
        );
        setProvince(userProvince?.name || "");

        if (user.ThanhPho) {
          const districtData = VnProvinces.getDistrictsByProvinceCode(
            user.ThanhPho
          );
          const userDistrict = districtData.find(
            (dist) => dist.code === user.Huyen
          );
          setDistrict(userDistrict?.name || "");
        }

        if (user.Huyen) {
          const wardData = VnProvinces.getWardsByDistrictCode(user.Huyen);
          const userWard = wardData.find((ward) => ward.code === user.Phuong);
          setWard(userWard?.name || "");
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchLocationData();
  }, [user.ThanhPho, user.Huyen, user.Phuong]);

  useEffect(() => {
    const fetchProvinces = async () => {
      const provincesData = await getProvinces();
      setProvinces(provincesData);
    };
    fetchProvinces();
  }, []);

  // Sử dụng useEffect để lấy danh sách quận/huyện khi tỉnh được chọn
  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        const districtsData = await getDistrictsByProvinceCode(
          selectedProvince
        );
        setDistricts(districtsData);
      };
      fetchDistricts();
    }
  }, [selectedProvince]);

  // Sử dụng useEffect để lấy danh sách phường/xã khi quận/huyện được chọn
  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        const wardsData = await getWardsByDistrictCode(selectedDistrict);
        setWards(wardsData);
      };
      fetchWards();
    }
  }, [selectedDistrict]);

  // Hàm xử lý sự kiện khi chọn tỉnh
  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedDistrict(""); // Reset quận/huyện khi tỉnh thay đổi
    setSelectedWard(""); // Reset phường/xã khi tỉnh thay đổi
    setDistricts([]); // Reset danh sách quận/huyện
    setWards([]); // Reset danh sách phường/xã
    setStateUserDetails((prevState) => ({
      ...prevState,
      ThanhPho: value,
      Huyen: "",
      Phuong: "",
    }));
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    setSelectedWard("");
    setWards([]);
    setStateUserDetails((prevState) => ({
      ...prevState,
      Huyen: value,
      Phuong: "",
    }));
  };

  //hàm chứa chi tiết người dùng
  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeCount = (LoaiMonAn, idFood) => {
    if (LoaiMonAn === "increase") {
      dispatch(increaseSoLuong({ idFood }));
    } else {
      const currentOrder = order?.DonHang.find((item) => item.food === idFood);
      if (currentOrder && currentOrder.SoLuong > 1) {
        dispatch(decreaseSoLuong({ idFood }));
      }
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

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked, dispatch]);

  useEffect(() => {
    if (isOpenModalInfo) {
      setStateUserDetails({
        ThanhPho: user?.ThanhPho,
        HoTen: user?.HoTen,
        Diachi: user?.Diachi,
        DienThoai: user?.DienThoai,
        Huyen: user?.Huyen,
        Phuong: user?.Phuong,
      });
      form.setFieldsValue({
        ThanhPho: user?.ThanhPho,
        HoTen: user?.HoTen,
        Diachi: user?.Diachi,
        DienThoai: user?.DienThoai,
        Huyen: user?.Huyen,
        Phuong: user?.Phuong,
      });
    }
  }, [isOpenModalInfo, user, form]);

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

  //Tạm tính
  const priceMemo = useMemo(() => {
    const result = order?.orderItemSelected?.reduce((total, cur) => {
      return total + cur.GiaMonAn * cur.SoLuong;
    }, 0);
    return result;
  }, [order]);

  //Giảm Giá
  const discountPriceMemo = useMemo(() => {
    const result = order?.orderItemSelected?.reduce((total, cur) => {
      const totalDiscount = cur.GiamGia ? cur.GiamGia : 0;
      return total + (priceMemo * (totalDiscount * cur.SoLuong)) / 100;
    }, 0);
    if (Number(result)) {
      return result;
    }
    return 0;
  }, [order, priceMemo]);

  //Phí giao hàng
  const deliveryPriceMemo = useMemo(() => {
    if (priceMemo >= 200000 && priceMemo < 500000) {
      return 10000;
    } else if (priceMemo >= 500000) {
      return 0;
    } else if (order?.orderItemSelected.length === 0) {
      return 0;
    } else {
      return 20000;
    }
  }, [priceMemo]);

  //Tổng tiền
  const totalPrice = useMemo(() => {
    return (
      Number(priceMemo) - Number(discountPriceMemo) + Number(deliveryPriceMemo)
    );
  }, [priceMemo, discountPriceMemo, deliveryPriceMemo]);

  //Thanh toan
  const handleAddCart = () => {
    if (!order?.orderItemSelected?.length) {
      message.error("Vui lòng chọn sản phẩm!!");
    } else if (
      !user?.HoTen ||
      !user?.Diachi ||
      !user?.DienThoai ||
      !user?.Huyen ||
      !user?.Phuong ||
      !user?.ThanhPho
    ) {
      setIsOpenModalInfo(true);
    } else {
      navigate("/Payment");
    }
  };

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.UpdateUser(id, { ...rests }, token);
    return res;
  });

  const handleCancelUpdate = () => {
    setStateUserDetails({
      Hoten: "",
      Email: "",
      DienThoai: "",
      isAdmin: false,
    });
    form.resetFields();
    setIsOpenModalInfo(false);
  };

  const handleUpdateInfoUser = () => {
    const { HoTen, Diachi, DienThoai, Huyen, Phuong, ThanhPho } =
      stateUserDetails;
    if (HoTen && Diachi && DienThoai && Huyen && Phuong && ThanhPho) {
      mutationUpdate.mutate(
        {
          id: user?.id,
          token: user?.access_token,
          ...stateUserDetails,
        },
        {
          onSuccess: () => {
            dispatch(
              updateUser({ HoTen, Diachi, DienThoai, Huyen, Phuong, ThanhPho })
            );
            setIsOpenModalInfo(false);
          },
        }
      );
    }
  };

  const showDrawer = () => {
    setIsOpenModalInfo(true);
  };

  const itemsDelivery = [
    {
      title: "20.000 VNĐ",
      description: "Dưới 200.000 VNĐ",
    },
    {
      title: "10.000 VNĐ",
      description: "Từ 200.000 VNĐ đến dưới 500.000 VNĐ",
    },
    {
      title: "0 VNĐ",
      description: "Trên 500.000 VNĐ trở đi",
    },
  ];

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
          Giỏ hàng
        </h4>
      </div>
      <StepComponent
        items={itemsDelivery}
        current={
          deliveryPriceMemo === 10000
            ? 2
            : deliveryPriceMemo === 20000
            ? 1
            : order.orderItemSelected.length === 0
            ? 0
            : 3
        }
      />
      <hr />
      <Row>
        <Col xs={12} md={8}>
          <div
            style={{ fontWeight: "600" }}
            className="d-flex align-items-center justify-content-between p-3 bg-light border-bottom flex-wrap"
          >
            <span
              className="d-inline-flex align-items-center"
              style={{ width: "390px", flex: "2" }}
            >
              <Checkbox
                onChange={handleOnchangeCheckAll}
                checked={listChecked?.length === order?.DonHang?.length}
              ></Checkbox>
              <span className="ms-2">
                Tất cả ({order?.DonHang?.length} món ăn)
              </span>
            </span>
            <span className="text-center flex-grow-1 d-none d-md-inline">
              Đơn giá
            </span>
            <span className="text-center flex-grow-1 d-none d-md-inline">
              Số lượng
            </span>
            <span className="text-center flex-grow-1 d-none d-md-inline">
              Thành tiền
            </span>
            <FaTrash
              style={{ cursor: "pointer" }}
              onClick={handleRemoveAllOrder}
              className="ms-2"
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
                  className=" d-flex align-items-center justify-content-between p-3 mt-2 bg-white border rounded flex-wrap"
                  style={{ width: "100%" }}
                  key={order.id || index} // Nếu order có thuộc tính id, hãy thêm key để tối ưu hóa
                >
                  <span
                    className="d-flex align-items-center"
                    style={{ minWidth: "100px" }}
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
                        width: "80px",
                        height: "80px",
                        marginLeft: "10px",
                        objectFit: "cover",
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
                  <span className="text-center flex-grow-1 d-none d-md-inline">
                    {converPrice(order?.GiaMonAn)}
                  </span>
                  <span
                    className="text-center flex-grow-1 d-flex align-items-center justify-content-center"
                    style={{ minWidth: "150px" }}
                  >
                    <InputGroup
                      className="quantity-control"
                      style={{ justifyContent: "center", maxWidth: "150px" }}
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
                        min={1}
                        type="input"
                        value={order?.SoLuong}
                        disabled
                        className="text-center"
                        style={{ maxWidth: "50px" }}
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
                  <span
                    className="text-center flex-grow-1 text-danger d-none d-md-inline"
                    style={{ minWidth: "120px" }}
                  >
                    {converPrice(order?.GiaMonAn * order?.SoLuong)}
                  </span>
                  <FaTrash
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => handleDeleteOrder(order?.food)}
                    className="ms-2"
                  />
                </div>
              );
            })
          )}
        </Col>

        <Col xs={12} md={4}>
          <Card
            className="border-0 shadow-sm"
            style={{ background: "#f9f9f9" }}
          >
            <Card.Body>
              {/* Thông tin đơn hàng */}
              {user?.Diachi ? (
                <div className="user-info mb-4">
                  <h6 className="d-flex justify-content-between align-items-center">
                    Thông tin đơn hàng
                    <Button
                      className="bth-changeInfo"
                      style={{
                        fontSize: "15px",
                        fontWeight: "500",
                        background: "#f2f2f2",
                        border: "1px solid #f2f2f2",
                        color: "#0080FF",
                      }}
                      onClick={showDrawer}
                    >
                      Thay đổi
                    </Button>
                  </h6>
                  <div className="user-info-item mb-2">
                    <span style={{ fontWeight: "500" }}>
                      <strong>Người nhận:</strong> {user.HoTen}
                    </span>
                  </div>
                  <div className="user-info-item mb-2">
                    <span style={{ fontWeight: "500" }}>
                      <strong>Điện thoại:</strong> 0{user.DienThoai}
                    </span>
                  </div>
                  <div className="user-info-item mb-2">
                    <span
                      className="text-truncate d-block"
                      style={{
                        fontWeight: "500",
                        maxWidth: "100%",
                        overflow: "hidden",
                      }}
                    >
                      <strong>Địa chỉ:</strong> {user.Diachi}, {ward},{" "}
                      {district}, {province}
                    </span>
                  </div>
                  <hr />
                </div>
              ) : null}

              {/* Chi tiết giá */}
              <div className="price-info">
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ fontWeight: "500" }}>Tạm tính</span>
                  <span>{converPrice(priceMemo)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ fontWeight: "500" }}>Giảm giá</span>
                  {/* <span>{`${discountPriceMemo} %`}</span> */}
                  <span>{converPrice(discountPriceMemo)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ fontWeight: "500" }}>Phí giao hàng</span>
                  <span>{converPrice(deliveryPriceMemo)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Tổng tiền</strong>
                  <strong className="text-danger">
                    {converPrice(totalPrice)}
                  </strong>
                </div>
                <small className="text-muted d-block mb-3">
                  (Đã bao gồm VAT nếu có)
                </small>
              </div>

              {/* Nút đặt món */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center", // Căn giữa cả hai nút
                  gap: "20px", // Khoảng cách giữa các nút
                  width: "100%",
                }}
              >
                <Button
                  onClick={() => navigate("/Product")}
                  style={{
                    background: "#ff5b6a",
                    border: "1px solid #ff5b6a",
                    fontSize: "18px",
                    fontWeight: "500",
                  }}
                  className="w-50 btn-order"
                >
                  Tiếp tục mua
                </Button>
                <Button
                  onClick={() => handleAddCart()}
                  style={{
                    background: "#ff5b6a",
                    border: "1px solid #ff5b6a",
                    fontSize: "18px",
                    fontWeight: "500",
                  }}
                  className="w-50 btn-order"
                >
                  Đặt món ăn
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ModalComponent
        // footer={null}
        title="Cập nhật thông tin người dùng"
        open={isOpenModalInfo}
        onCancel={handleCancelUpdate}
        onOk={handleUpdateInfoUser}
      >
        <Form
          form={form}
          name="updateUser"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          style={{
            maxWidth: 600,
          }}
          // onFinish={onUpdateUser}
          autoComplete="on"
        >
          <Form.Item
            label="Họ tên"
            name="HoTen"
            rules={[
              {
                required: true,
                message: "Hãy nhập họ tên!",
              },
            ]}
          >
            <InputComponent
              value={stateUserDetails.HoTen}
              onChange={handleOnchangeDetails}
              name="HoTen"
            />
          </Form.Item>

          <Form.Item
            label="Điện thoại"
            name="DienThoai"
            rules={[
              {
                required: true,
                message: "Hãy nhập số điện thoại!",
              },
            ]}
          >
            <InputComponent
              value={stateUserDetails.DienThoai}
              onChange={handleOnchangeDetails}
              name="DienThoai"
            />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="Diachi"
            rules={[
              {
                required: true,
                message: "Hãy nhập địa chỉ!",
              },
            ]}
          >
            <InputComponent
              value={stateUserDetails.Diachi}
              onChange={handleOnchangeDetails}
              name="Diachi"
            />
          </Form.Item>

          <Form.Item label="Tỉnh/Thành phố" name="ThanhPho">
            <Select
              showSearch
              placeholder="Chọn tỉnh/thành"
              onChange={handleProvinceChange}
              value={stateUserDetails.ThanhPho}
            >
              {provinces.map((province) => (
                <Select.Option key={province.code} value={province.code}>
                  {province.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Quận/Huyện" name="Huyen">
            <Select
              showSearch
              placeholder="Select a district"
              onChange={handleDistrictChange}
              value={stateUserDetails.Huyen}
            >
              {districts.map((district) => (
                <Select.Option key={district.code} value={district.code}>
                  {district.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Phường/Xã"
            name="Phuong"
            rules={[
              {
                required: true,
                message: "Hãy nhập phường xã!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select a ward"
              onChange={(value) => {
                form.setFieldsValue({ Phuong: value });
                setStateUserDetails((prevState) => ({
                  ...prevState,
                  Phuong: value,
                }));
              }}
              value={stateUserDetails.Phuong}
            >
              {wards.map((ward) => (
                <Select.Option key={ward.code} value={ward.code}>
                  {ward.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </ModalComponent>
    </div>
  );
};

export default OrderPage;
