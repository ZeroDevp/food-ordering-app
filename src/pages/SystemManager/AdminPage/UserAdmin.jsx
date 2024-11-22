import React, { useCallback, useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  Button,
  Drawer,
  Form,
  Image,
  Layout,
  Select,
  Switch,
  theme,
  Typography,
} from "antd";
import SiderComponent from "../../../components/SiderComponent/SiderComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../../../components/ModalComponent/ModalComponent";
import Loading from "../../../components/LoadingComponent/Loading";
import TableComponent from "../../../components/TableComponent/TableComponent";
import InputComponent from "../../../components/InputComponent/InputComponent";

import * as Message from "../../../components/Message/Message";
import { truncateDescription } from "../../../utils";
import { useMutationHooks } from "../../../hook/useMutationHook";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import * as UserService from "../../../service/UserService";
import {
  getProvinces,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode,
} from "vn-local-plus";
const { Header, Content } = Layout;

const UserAdmin = () => {
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [loadingDrawer, setLoadingDrawer] = useState(true);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [setIsModalOpen] = useState(false);
  const user = useSelector((state) => state?.user);
  const [marginLeft, setMarginLeft] = useState(80);
  const [collapsed, setCollapsed] = useState(true);
  const [form] = Form.useForm();
  //Phân quyền admin cho user
  const [isAdmin, setIsAdmin] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  useEffect(() => {
    const fetchProvinces = async () => {
      const provincesData = await getProvinces();
      setProvinces(provincesData);
    };
    fetchProvinces();
  }, []);

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

  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        const wardsData = await getWardsByDistrictCode(selectedDistrict);
        setWards(wardsData);
      };
      fetchWards();
    }
  }, [selectedDistrict]);

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedDistrict("");
    setSelectedWard("");
    setDistricts([]);
    setWards([]);
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

  const inittial = () => ({
    HoTen: "",
    Email: "",
    isAdmin: false,
    AnhDaiDien: "",
    Diachi: "",
    DienThoai: "",
    Huyen: "",
    Phuong: "",
    ThanhPho: "",
  });

  const [setStateUser] = useState(inittial());

  const [stateUserDetails, setStateUserDetails] = useState(inittial());

  //hàm đóng mở sidebar
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setMarginLeft(collapsed ? 280 : 80);
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.UpdateUser(id, { ...rests }, token);
    return res;
  });

  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    const res = UserService.deleteUser(id, token);
    return res;
  });

  //Hàm getAllFood từ API
  const getAllUser = async () => {
    const res = await UserService.getAllUser(user?.access_token);
    return res;
  };

  const {
    data: dataUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  const {
    data: dataDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDelete;

  const queryUser = useQuery({
    queryKey: ["users"],
    queryFn: getAllUser,
  });

  const { isLoading: isLoadingUser, data: users } = queryUser;

  //Hàm cancel khi 0 muốn tạo món ăn
  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setStateUser({
      HoTen: "",
      Email: "",
      isAdmin: false,
      DienThoai: "",
    });
    form.resetFields();
  }, [form, setStateUser, setIsModalOpen]);

  const handleCloseDrawer = useCallback(() => {
    setIsOpenDrawer(false);
    // Do not reset stateFoodDetails here
  }, []);

  //Xử lý sự kiện khi update món ăn thành công
  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      Message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      Message.error();
    }
  }, [
    isSuccessUpdated,
    dataUpdated?.status,
    isErrorUpdated,
    handleCloseDrawer,
  ]);

  //Xử lý sự kiện khi delete món ăn thành công
  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      Message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      Message.error();
    }
  }, [isSuccessDeleted, dataDeleted?.status, isErrorDeleted, handleCancel]);

  const onClose = () => {
    setIsOpenDrawer(false);
  };

  //Hàm cancel Delete
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  //Hàm xác nhận xóa món ăn
  const handleDeleteUser = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  //hàm chứa chi tiết món ăn
  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const onUpdateUser = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateUserDetails,
        isAdmin, //Thêm isAdmin vào đây để được update trạng thái
      },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  //Hàm lấy chi tiết món ăn từ API
  const fetchgetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailUser(rowSelected);
    if (res?.data) {
      setStateUserDetails({
        HoTen: res?.data.HoTen,
        Email: res?.data?.Email,
        MatKhau: res?.data?.MatKhau,
        isAdmin: res?.data?.isAdmin,
        AnhDaiDien: res?.data?.AnhDaiDien,
        Diachi: res?.data?.Diachi,
        DienThoai: res?.data?.DienThoai,
        Huyen: res?.data?.Huyen,
        Phuong: res?.data?.Phuong,
        ThanhPho: res?.data?.ThanhPho,
      });
      setIsAdmin(res?.data?.isAdmin); // Cập nhật isAdmin từ dữ liệu lấy về
    }
    // setisLoadingUpdate(false);
  };

  useEffect(() => {
    if (isOpenDrawer) {
      form.setFieldsValue(stateUserDetails); // Set form values when the drawer opens
      setIsAdmin(stateUserDetails.isAdmin); // Cập nhật trạng thái isAdmin từ stateUser Details
    }
  }, [isOpenDrawer, stateUserDetails, form]);

  //cập nhật trạng thái admin
  const handleSwitchChange = (checked) => {
    setIsAdmin(checked);
    setStateUserDetails((prevState) => ({
      ...prevState,
      isAdmin: checked, // Cập nhật isAdmin vào stateUser Details
    }));
  };

  useEffect(() => {
    if (selectedWard) {
      console.log("Ward selected:", selectedWard);
    }
  }, [selectedWard]);

  useEffect(() => {
    if (rowSelected) {
      fetchgetDetailsUser(rowSelected);
    }
    // setIsOpenDrawer(true);
  }, [rowSelected]);

  //Hàm lấy lấy chi tiết món ăn khi click vào món ăn
  const handleDetailsFood = () => {
    setLoadingDrawer(true);
    setIsOpenDrawer(true);
    setTimeout(() => {
      setLoadingDrawer(false);
    }, 1000);
  };

  //Ham render chọn action
  const renderAction = () => {
    return (
      <div
        style={{
          fontSize: "20px",
          padding: "5px 5px",
          display: "flex",
          justifyContent: "space-evenly",

          cursor: "pointer",
        }}
      >
        <div>
          <FontAwesomeIcon icon={faPenToSquare} onClick={handleDetailsFood} />
        </div>
        <div>
          <FontAwesomeIcon
            icon={faTrash}
            onClick={() => {
              setIsModalOpenDelete(true);
            }}
          />
        </div>
      </div>
    );
  };

  //Hàm chứa các cột trong dataTable
  const columns = [
    {
      title: <div style={{ textAlign: "center" }}>Họ và tên</div>,
      dataIndex: "HoTen",
      width: "30%",
      responsive: ["lg"],
      sorter: (a, b) => a.HoTen.length - b.HoTen.length,
    },
    {
      title: <div style={{ textAlign: "center" }}>Email</div>,
      dataIndex: "Email",
      width: "20%",
      responsive: ["md"],
    },

    {
      title: <div style={{ textAlign: "center" }}>Quản lý</div>,
      dataIndex: "isAdmin",
      width: "20%",
      align: "center",
      responsive: ["md"],
    },

    {
      title: <div style={{ textAlign: "center" }}>Điện thoại</div>,
      dataIndex: "DienThoai",
      align: "center",
      width: "10%",
      responsive: ["lg"],
      // sorter: (a, b) => a.LoaiMonAn - b.LoaiMonAn,
    },

    {
      title: <div style={{ textAlign: "center" }}>Chức năng</div>,
      dataIndex: "Action",
      width: "10%",
      responsive: ["md"],

      render: renderAction,
    },
  ];

  //Hàm này chứa dữ liệu các món ăn trong bảng
  const dataTable =
    users?.data?.length &&
    users?.data?.map((user) => {
      return {
        ...user,
        key: user._id,
        isAdmin: user.isAdmin ? "Admin" : "User",
        MatKhau: truncateDescription(user.MatKhau, 100),
        // GiamGia: user.GiamGia,
      };
    });

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#FEE4CC" }}>
      <SiderComponent collapsed={collapsed} user={user} selectKey={"3"} />
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
            QUẢN LÝ NGƯỜI DÙNG
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
          <Loading isLoading={isLoadingUser}>
            <TableComponent
              columns={columns}
              isLoading={isLoadingUser}
              pagination={{
                position: ["bottomCenter"],
                pageSize: 6,
              }}
              data={dataTable}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    setRowSelected(record._id);
                  },
                };
              }}
            />
          </Loading>

          <Drawer
            forceRender
            title="Cập nhật người dùng"
            onClose={onClose}
            open={isOpenDrawer}
            loading={loadingDrawer}
            width="40%"
          >
            <Loading isLoading={isLoadingUser}>
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
                onFinish={onUpdateUser}
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
                  label="Email"
                  name="Email"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập Email!",
                    },
                  ]}
                >
                  <InputComponent
                    rows={4}
                    value={stateUserDetails.Email}
                    onChange={handleOnchangeDetails}
                    name="Email"
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

                <Form.Item label="Role">
                  <Switch checked={isAdmin} onChange={handleSwitchChange} />
                  <Typography.Text style={{ marginLeft: 8 }}>
                    {stateUserDetails.isAdmin ? "Admin" : "User "}
                  </Typography.Text>
                </Form.Item>

                <Form.Item
                  label="Ảnh đại diện"
                  name="AnhDaiDien"
                  rules={[
                    {
                      required: false,
                      message: "Hãy thêm hình ảnh!",
                    },
                  ]}
                >
                  <div>
                    {stateUserDetails?.AnhDaiDien && (
                      <Image
                        src={stateUserDetails?.AnhDaiDien}
                        alt="Ảnh đại diện"
                        style={{
                          height: "80px",
                          width: "80px",
                          marginLeft: "10px",
                          borderRadius: "10%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 20, span: 20 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "90%" }}
                  >
                    Cập nhật
                  </Button>
                </Form.Item>
              </Form>
            </Loading>
          </Drawer>
          <ModalComponent
            title="Xóa người dùng"
            open={isModalOpenDelete}
            onCancel={handleCancelDelete}
            onOk={handleDeleteUser}
          >
            <div>
              Bạn có chắc xóa người dùng có họ tên là {stateUserDetails.HoTen}{" "}
              này không
            </div>
          </ModalComponent>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserAdmin;
