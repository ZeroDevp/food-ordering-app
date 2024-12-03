import {
  PhoneOutlined,
  UserOutlined,
  MailOutlined,
  TruckOutlined,
  EnvironmentOutlined,
  UploadOutlined,
  DeleteOutlined,
  LogoutOutlined,
  SignatureOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Image,
  Input,
  message,
  Select,
  Upload,
  Modal,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../service/UserService";
import { resetUser, updateUser } from "../../redux/userSlide";
import VnProvinces from "vn-local-plus";
import { useMutationHooks } from "../../hook/useMutationHook";
import { getbase64 } from "../../utils";
import "./ProfilePage.css";
import customImage from "../../assets/img/logout.png";
import { clearCart } from "../../redux/slide/orderSlide";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [Email, setEmail] = useState("");
  const [HoTen, setHoTen] = useState("");
  const [DienThoai, setDienThoai] = useState("");
  const [Diachi, setDiachi] = useState("");
  const [AnhDaiDien, setAnhDaiDien] = useState("");

  const [ThanhPho, setThanhPho] = useState("");
  const [Huyen, setHuyen] = useState("");
  const [Phuong, setPhuong] = useState("");

  const [provinces, setProvinces] = useState([]);
  const [Huyens, setHuyens] = useState([]);
  const [Phuongs, setPhuongs] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const [showUpload, setShowUpload] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  useEffect(() => {
    setEmail(user?.Email);
    setHoTen(user?.HoTen);
    setDienThoai(user?.DienThoai);
    setDiachi(user?.Diachi);
    setThanhPho(user?.ThanhPho);
    setHuyen(user?.Huyen);
    setPhuong(user?.Phuong);
    setAnhDaiDien(user?.AnhDaiDien);
  }, [user]);

  const handleOnchangeName = (e) => {
    setHoTen(e.target.value);
  };

  const handleOnchangePhone = (e) => {
    setDienThoai(e.target.value);
  };

  const handleOnchangeAddress = (e) => {
    setDiachi(e.target.value);
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getbase64(file.originFileObj);
    }
    setAnhDaiDien(file.preview);
  };

  const handleDeleteAvatar = () => {
    setAnhDaiDien(null); // Đặt lại ảnh đại diện thành null để xóa ảnh hiện tại
  };

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const res = VnProvinces.getProvinces();
        setProvinces(res);
      } catch (error) {
        console.log("Error fetching provinces: ", error);
      }
    };
    fetchProvince();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (ThanhPho) {
        try {
          const res = VnProvinces.getDistrictsByProvinceCode(ThanhPho);
          setHuyens(res);
          const currentDistrict = res.find((d) => d.code === Huyen);
          if (currentDistrict) {
            setHuyen(currentDistrict.code);
          }
        } catch (error) {
          console.log("Error fetching districts: ", error);
        }
      }
    };
    fetchDistricts();
  }, [ThanhPho, Huyen]);

  useEffect(() => {
    const fetchWards = async () => {
      if (Huyen) {
        try {
          const res = VnProvinces.getWardsByDistrictCode(Huyen);
          setPhuongs(res);
          const currentWard = res.find((w) => w.code === Phuong);
          if (currentWard) {
            setPhuong(currentWard.code);
          }
        } catch (error) {
          console.log("Error fetching districts: ", error);
        }
      }
    };
    fetchWards();
  }, [Huyen, Phuong]);

  const handleProvinceChange = async (value) => {
    setThanhPho(value);
    setHuyen("");
    setPhuong("");
    try {
      const res = VnProvinces.getDistrictsByProvinceCode(value);
      setHuyens(res);
      setPhuongs([]);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleDistrictChange = async (value) => {
    setHuyen(value);
    setPhuong("");
    try {
      const res = VnProvinces.getWardsByDistrictCode(value);
      setPhuongs(res);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const handleWardChange = (value) => {
    setPhuong(value);
  };

  const handleUpdateClick = () => {
    setEditMode(true);
    setShowUpload(true);
    setShowDeleted(true);
  };

  const handleSaveClick = () => {
    mutation.mutate({
      id: user?.id,
      HoTen,
      AnhDaiDien,
      DienThoai,
      Diachi,
      ThanhPho,
      Huyen,
      Phuong,
      access_token: user?.access_token,
    });
    setEditMode(false);
    setShowUpload(false);
    setShowDeleted(false);
  };

  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    UserService.UpdateUser(id, rests, access_token);
  });

  const { isSuccess, isError } = mutation;

  const handleGetDetailsUser = useCallback(
    async (id, token) => {
      const res = await UserService.getDetailUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    },
    [dispatch]
  );

  useEffect(() => {
    if (isSuccess) {
      message.success("Cập nhật thành công!");
      handleGetDetailsUser(user?.id, user?.access_token);
    } else if (isError) {
      message.error("Cập nhật không thành công!!");
    }
  }, [isSuccess, isError, handleGetDetailsUser, user]);

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

  // const handleLogout = async () => {
  //   await UserService.logoutUser();
  //   dispatch(resetUser());
  //   dispatch(clearCart());
  //   handleNavigateLogin();
  // };

  // const handleCancelLogout = () => {
  //   setIsLogoutModalVisible(false);
  // };

  // const confirmLogout = () => {
  //   handleLogout();
  //   setIsLogoutModalVisible(false);
  // };

  // const handleNavigateLogin = () => {
  //   navigate("/SignIn");
  // };

  return (
    <div>
      <div className="container pt-5" style={{ marginBottom: "100px" }}>
        <div className="row ">
          {/* <div className="col-3 ">
            <div
              className="card border-0 shadow "
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
                {showUpload && (
                  <Upload
                    maxCount={1}
                    className="ant-upload-list-item-name"
                    onChange={handleOnchangeAvatar}
                  >
                    <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                  </Upload>
                )}

                {showDeleted && (
                  <Button
                    type="danger"
                    style={{ marginTop: "10px", background: "#fff" }}
                    onClick={handleDeleteAvatar}
                    icon={<DeleteOutlined />}
                  >
                    Xóa ảnh đại diện
                  </Button>
                )}
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

                
              </ul>
            </div>
          </div> */}

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
                {showUpload && (
                  <Upload
                    maxCount={1}
                    className="ant-upload-list-item-name"
                    onChange={handleOnchangeAvatar}
                  >
                    <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                  </Upload>
                )}

                {showDeleted && (
                  <Button
                    type="danger"
                    style={{ marginTop: "10px", background: "#fff" }}
                    onClick={handleDeleteAvatar}
                    icon={<DeleteOutlined />}
                  >
                    Xóa ảnh đại diện
                  </Button>
                )}
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

          <div className="col-9 ">
            <div
              className="card border-0 shadow "
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
                THÔNG TIN TÀI KHOẢN
              </h2>
              <Form layout="vertical">
                <Form.Item label="Email">
                  <Input
                    type="text"
                    size="large"
                    placeholder="Email"
                    prefix={<MailOutlined />}
                    value={Email}
                    disabled={true}
                  />
                </Form.Item>
                <Form.Item label="Họ tên">
                  <Input
                    type="text"
                    size="large"
                    placeholder="Họ và Tên"
                    prefix={<UserOutlined />}
                    onChange={handleOnchangeName}
                    value={HoTen}
                    disabled={!editMode}
                  />
                </Form.Item>

                <Form.Item label="Số điện thoại">
                  <Input
                    type="text"
                    size="large"
                    placeholder="Số điện thoại"
                    prefix={<PhoneOutlined />}
                    onChange={handleOnchangePhone}
                    value={DienThoai}
                    disabled={!editMode}
                  />
                </Form.Item>

                <Form.Item label="Địa chỉ">
                  <Input
                    type="text"
                    size="large"
                    placeholder="Địa chỉ"
                    prefix={<EnvironmentOutlined />}
                    onChange={handleOnchangeAddress}
                    value={Diachi}
                    disabled={!editMode}
                  />
                </Form.Item>

                <div className="row">
                  <div className="col-md-4">
                    <Form.Item>
                      <Select
                        defaultValue="Chọn tỉnh thành"
                        value={ThanhPho || undefined}
                        style={{ width: "100%" }}
                        onChange={handleProvinceChange}
                        options={[
                          { value: "", label: "Chọn tỉnh thành" },
                          ...provinces.map((province) => ({
                            value: province.code,
                            label: province.name,
                          })),
                        ]}
                        disabled={!editMode}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item>
                      <Select
                        defaultValue="Chọn quận huyện"
                        style={{ width: "100%" }}
                        onChange={handleDistrictChange}
                        value={Huyen || undefined}
                        options={[
                          { value: "", label: "Chọn quận huyện" },
                          ...Huyens.map((Huyen) => ({
                            value: Huyen.code,
                            label: Huyen.name,
                          })),
                        ]}
                        disabled={!editMode}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item>
                      <Select
                        defaultValue="Chọn phường xã"
                        value={Phuong || undefined}
                        style={{ width: "100%" }}
                        onChange={handleWardChange}
                        options={[
                          { value: "", label: "Chọn phường xã" },
                          ...Phuongs.map((Phuong) => ({
                            value: Phuong.code,
                            label: Phuong.name,
                          })),
                        ]}
                        disabled={!editMode || !Huyen}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  {editMode ? (
                    <Button
                      type="primary"
                      size="large"
                      style={{
                        width: "200px",
                        backgroundColor: "#ff5b6a",
                        borderColor: "#ff5b6a",
                        color: "#fff",
                        fontSize: "16px",
                      }}
                      onClick={handleSaveClick}
                    >
                      <SaveOutlined />
                      Lưu thông tin
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      size="large"
                      style={{
                        width: "200px",
                        backgroundColor: "#ff5b6a",
                        borderColor: "#ff5b6a",
                        color: "#fff",
                        fontSize: "16px",
                      }}
                      onClick={handleUpdateClick}
                    >
                      <SignatureOutlined />
                      Cập nhật thông tin
                    </Button>
                  )}
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
