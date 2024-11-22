import { Form, Select } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { converPrice } from "../../utils";
import "../Orderpage/Cart.css";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import {
  getProvinces,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode,
} from "vn-local-plus";
import { useMutationHooks } from "../../hook/useMutationHook";
import * as UserService from "../../service/UserService";
import * as OrderService from "../../service/OrderService";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/userSlide";
import VnProvinces from "vn-local-plus";
import { removeAllOrderFood } from "../../redux/slide/orderSlide";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/LoadingComponent/Loading";

const PaymentPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [listChecked, setListChecked] = useState([]);
  const dispatch = useDispatch();
  const [isOpenModalInfo, setIsOpenModalInfo] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState("");
  const [payment, setPayment] = useState("");

  const handleCheckboxChange = (e) => {
    setPayment(e.target.id);
  };

  const handleDeliveryCheckboxChange = (e) => {
    setDelivery(e.target.id);
  };

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
  // const [selectedDelivery, setSelectedDelivery] = useState("FAST");
  // const [selectedPayment, setSelectedPayment] = useState("CASH");

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

  // const handleRemoveAllOrder = () => {
  //   if (listChecked?.length > 1) {
  //     dispatch(removeAllOrderFood({ listChecked }));
  //   }
  // };

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
      // return total + (priceMemo * cur.GiamGia) / 100;
    }, 0);
    if (Number(result)) {
      return result;
    }
    return 0;
  }, [order, priceMemo]);

  //Phí giao hàng
  const deliveryPriceMemo = useMemo(() => {
    if (priceMemo >= 200000) {
      return 10000;
    } else if (priceMemo === 0) {
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
  const handleAddOrder = () => {
    if (
      user?.access_token &&
      order?.orderItemSelected &&
      user?.HoTen &&
      user?.Diachi &&
      user?.ThanhPho &&
      user?.Huyen &&
      user?.Phuong &&
      priceMemo &&
      user?.id
    ) {
      mutationAddOrder.mutate({
        token: user?.access_token,
        DonHang: order?.orderItemSelected,
        HoTen: user?.HoTen,
        DienThoai: user?.DienThoai,
        Diachi: user?.Diachi,
        ThanhPho: user?.ThanhPho,
        Huyen: user?.Huyen,
        Phuong: user?.Phuong,
        PhuongThucThanhToan: payment,
        GiaDonHang: priceMemo,
        GiaVanChuyen: deliveryPriceMemo,
        TongTien: totalPrice,
        NguoiDung: user?.id,
      });
    }
  };

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.UpdateUser(id, { ...rests }, token);
    return res;
  });

  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rests } = data;
    const res = OrderService.createOrder({ ...rests }, token);
    return res;
  });

  const {
    data: dataAdd,
    isLoading: isLoadingAddOrder,
    isSuccess,
    isError,
  } = mutationAddOrder;

  useEffect(() => {
    if (isSuccess && dataAdd?.status === "OK") {
      const arrOrdered = [];
      order?.orderItemSelected?.forEach((element) => {
        arrOrdered.push(element.food);
      });
      dispatch(removeAllOrderFood({ listChecked: arrOrdered }));
      message.success("Đặt món ăn thành công!");
      navigate("/OrderSuccess", {
        state: {
          delivery,
          payment,
          orders: order?.orderItemSelected,
          priceMemo: priceMemo,
        },
      });
    } else if (isError) {
      message.error("Đặt món ăn không thành công!");
    }
  }, [isSuccess, isError]);

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

  // const { data } = mutationUpdate;
  // console.log("data", data);

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

  return (
    <div className="p-4 bg-light">
      <Loading isLoading={isLoadingAddOrder}>
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
            Chọn phương thức thanh toán
          </h4>
        </div>
        <Row>
          <Col xs={12} md={8}>
            <Card
              className="border-0 shadow-sm"
              style={{ background: "#f9f9f9" }}
            >
              <Card.Body>
                {/* Phương thức giao hàng */}
                <div className="user-info mb-4">
                  <h5 className="mb-3" style={{ fontWeight: "600" }}>
                    Chọn phương thức giao hàng
                  </h5>
                  <Row>
                    <Col xs={12} sm={4} className="mb-3">
                      <div
                        style={{
                          border: "1px solid #cccc",
                          borderRadius: "10px",
                          height: "120px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#ffffff",
                          cursor: "pointer",
                          transition: "all 0.3s ease-in-out",
                        }}
                        className="delivery-method hover-effect"
                      >
                        <label
                          htmlFor="fast"
                          className="d-flex align-items-center"
                          style={{ fontSize: "16px" }}
                        >
                          <input
                            type="checkbox"
                            id="fast"
                            className="me-2"
                            onChange={handleDeliveryCheckboxChange}
                            checked={delivery === "fast"}
                          />
                          <span
                            style={{
                              fontWeight: 700,
                              color: "#ff7b02",
                              marginRight: "10px",
                            }}
                          >
                            FAST
                          </span>
                          Giao hàng tiết kiệm
                        </label>
                      </div>
                    </Col>

                    <Col xs={12} sm={4} className="mb-3">
                      <div
                        style={{
                          border: "1px solid #cccc",
                          borderRadius: "10px",
                          height: "120px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#ffffff",
                          cursor: "pointer",
                          transition: "all 0.3s ease-in-out",
                        }}
                        className="delivery-method hover-effect"
                      >
                        <label
                          htmlFor="GRAB_FOOD"
                          className="d-flex align-items-center"
                          style={{ fontSize: "16px" }}
                        >
                          <input
                            type="checkbox"
                            id="GRAB_FOOD"
                            className="me-2"
                            onChange={handleDeliveryCheckboxChange}
                            checked={delivery === "GRAB_FOOD"}
                          />
                          <span
                            style={{
                              fontWeight: 700,
                              color: "#ff7b02",
                              marginRight: "10px",
                            }}
                          >
                            GRAB_FOOD
                          </span>
                          Giao hàng tiết kiệm
                        </label>
                      </div>
                    </Col>

                    <Col xs={12} sm={4} className="mb-3">
                      <div
                        style={{
                          border: "1px solid #cccc",
                          borderRadius: "10px",
                          height: "120px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#ffffff",
                          cursor: "pointer",
                          transition: "all 0.3s ease-in-out",
                        }}
                        className="delivery-method hover-effect"
                      >
                        <label
                          htmlFor="SHOPEE_FOOD"
                          className="d-flex align-items-center"
                          style={{ fontSize: "16px" }}
                        >
                          <input
                            type="checkbox"
                            id="SHOPEE_FOOD"
                            className="me-2"
                            onChange={handleDeliveryCheckboxChange}
                            checked={delivery === "SHOPEE_FOOD"}
                          />
                          <span
                            style={{
                              fontWeight: 700,
                              color: "#ff7b02",
                              marginRight: "10px",
                            }}
                          >
                            SHOPEE_FOOD
                          </span>
                          Giao hàng tiết kiệm
                        </label>
                      </div>
                    </Col>
                  </Row>
                </div>

                <hr />

                {/* Phương thức thanh toán */}
                <div className="user-info">
                  <h5 className="mb-3" style={{ fontWeight: "600" }}>
                    Chọn phương thức thanh toán
                  </h5>
                  <Row>
                    <Col xs={12} sm={3} className="mb-3">
                      <div
                        style={{
                          border: "1px solid #cccc",
                          borderRadius: "10px",
                          height: "120px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#ffffff",
                          cursor: "pointer",
                          transition: "all 0.3s ease-in-out",
                        }}
                        className="payment-method hover-effect"
                      >
                        <label
                          htmlFor="paymentincash"
                          className="d-flex align-items-center"
                          style={{ fontSize: "16px" }}
                        >
                          <input
                            type="checkbox"
                            id="paymentincash"
                            className="me-2"
                            onChange={handleCheckboxChange}
                            checked={payment === "paymentincash"}
                          />
                          <span style={{ marginLeft: "5px" }}>
                            Thanh toán tiền mặt khi nhận món ăn
                          </span>
                        </label>
                      </div>
                    </Col>

                    <Col xs={12} sm={3} className="mb-3">
                      <div
                        style={{
                          border: "1px solid #cccc",
                          borderRadius: "10px",
                          height: "120px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#ffffff",
                          cursor: "pointer",
                          transition: "all 0.3s ease-in-out",
                        }}
                        className="payment-method hover-effect"
                      >
                        <label
                          htmlFor="MoMo"
                          className="d-flex align-items-center"
                          style={{ fontSize: "16px" }}
                        >
                          <input
                            type="checkbox"
                            id="MoMo"
                            className="me-2"
                            onChange={handleCheckboxChange}
                            checked={payment === "MoMo"}
                          />
                          <span style={{ marginLeft: "5px" }}>
                            Thanh toán bằng ví MoMo
                          </span>
                        </label>
                      </div>
                    </Col>

                    <Col xs={12} sm={3} className="mb-3">
                      <div
                        style={{
                          border: "1px solid #cccc",
                          borderRadius: "10px",
                          height: "120px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#ffffff",
                          cursor: "pointer",
                          transition: "all 0.3s ease-in-out",
                        }}
                        className="payment-method hover-effect"
                      >
                        <label
                          htmlFor="ZaloPay"
                          className="d-flex align-items-center"
                          style={{ fontSize: "16px" }}
                        >
                          <input
                            type="checkbox"
                            id="ZaloPay"
                            className="me-2"
                            onChange={handleCheckboxChange}
                            checked={payment === "ZaloPay"}
                          />
                          <span style={{ marginLeft: "5px" }}>
                            Thanh toán bằng ví ZaloPay
                          </span>
                        </label>
                      </div>
                    </Col>

                    <Col xs={12} sm={3} className="mb-3">
                      <div
                        style={{
                          border: "1px solid #cccc",
                          borderRadius: "10px",
                          height: "120px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#ffffff",
                          cursor: "pointer",
                          transition: "all 0.3s ease-in-out",
                        }}
                        className="payment-method hover-effect"
                      >
                        <label
                          htmlFor="PayPal"
                          className="d-flex align-items-center"
                          style={{ fontSize: "16px" }}
                        >
                          <input
                            type="checkbox"
                            id="PayPal"
                            className="me-2"
                            onChange={handleCheckboxChange}
                            checked={payment === "PayPal"}
                          />
                          <span style={{ marginLeft: "5px" }}>
                            Thanh toán bằng PayPal
                          </span>
                        </label>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
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
                    onClick={() => navigate("/Order")}
                    style={{
                      background: "#ff5b6a",
                      border: "1px solid #ff5b6a",
                      fontSize: "18px",
                      fontWeight: "500",
                    }}
                    className="w-50 btn-order"
                  >
                    Quay về
                  </Button>
                  <Button
                    onClick={() => handleAddOrder()}
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
      </Loading>
    </div>
  );
};

export default PaymentPage;
