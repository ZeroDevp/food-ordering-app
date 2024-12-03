import React, { useCallback, useEffect, useState } from "react";
import {
  DollarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PercentageOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Drawer,
  Form,
  Image,
  InputNumber,
  Layout,
  Select,
  theme,
  Typography,
  Upload,
} from "antd";
import SiderComponent from "../../../components/SiderComponent/SiderComponent";
import { useSelector } from "react-redux";
import InputComponent from "../../../components/InputComponent/InputComponent";
import {
  converPrice,
  getbase64,
  renderOptions,
  truncateDescription,
} from "../../../utils";
import * as FoodService from "../../../service/FoodService";
import { useMutationHooks } from "../../../hook/useMutationHook";
import Loading from "../../../components/LoadingComponent/Loading";
import * as Message from "../../../components/Message/Message";
import TableComponent from "../../../components/TableComponent/TableComponent";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import TextArea from "antd/es/input/TextArea";
import ModalComponent from "../../../components/ModalComponent/ModalComponent";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const FoodAdmin = () => {
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [loadingDrawer, setLoadingDrawer] = useState(true);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector((state) => state?.user);
  const [marginLeft, setMarginLeft] = useState(80);
  const [collapsed, setCollapsed] = useState(true);
  // const [typeSelect, setTypeSelect] = useState("");
  const [form] = Form.useForm();

  // const [BanChay, setBanChay] = useState(false);

  const inittial = () => ({
    TenMonAn: "",
    LoaiMonAn: "",
    HinhAnh: null,
    GiaMonAn: "",
    DanhGia: "",
    MoTa: "",
    GiamGia: "",
    newPhanLoai: "",
    // BanChay: false,
  });

  const [stateFood, setStateFood] = useState(inittial());

  const [stateFoodDetails, setStateFoodDetails] = useState(inittial());

  //hàm đóng mở sidebar
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setMarginLeft(collapsed ? 280 : 80);
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  //Hàm gọi API createFood
  const mutation = useMutationHooks((data) => {
    return FoodService.createFood(data);
  });

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = FoodService.updateFood(id, token, {
      ...rests,
      GiamGia: rests.GiamGia,
    });
    return res;
  });

  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    const res = FoodService.deleteFood(id, token);
    return res;
  });

  //Hàm getAllFood từ API
  const getAllFood = async () => {
    const res = await FoodService.getAllFood();
    return res;
  };

  //hàm lấy phân loại món ăn
  const fetchAllTypefood = async () => {
    const res = await FoodService.getAllTypeFood();
    return res;
  };

  const { data, isLoading, isSuccess, isError } = mutation;
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

  const typeFood = useQuery({
    queryKey: ["type-food"],
    queryFn: fetchAllTypefood,
  });

  const queryFood = useQuery({
    queryKey: ["foods"],
    queryFn: getAllFood,
  });

  const { isLoading: isLoadingFood, data: foods } = queryFood;

  //Hàm cancel khi 0 muốn tạo món ăn
  // const handleCancel = useCallback(() => {
  //   setIsModalOpen(false);
  //   setStateFood({
  //     TenMonAn: "",
  //     LoaiMonAn: "",
  //     HinhAnh: null,
  //     GiaMonAn: "",
  //     DanhGia: "",
  //     MoTa: "",
  //     GiamGia: "",
  //     // BanChay: false,
  //   });
  //   form.resetFields();
  // }, [form]);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setStateFood(inittial()); // Reset stateFood
    form.resetFields(); // Reset form fields
  }, [form]);

  // const handleCloseDrawer = useCallback(() => {
  //   setIsOpenDrawer(false);
  //   // Do not reset stateFoodDetails here
  // }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsOpenDrawer(false);
    setStateFoodDetails(inittial()); // Reset stateFoodDetails
    form.resetFields(); // Reset form fields
  }, [form]);

  //Xử lý sự kiện khi thêm món ăn thành công
  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      Message.success();
      handleCancel();
    } else if (isError) {
      Message.error();
    }
  }, [isSuccess, data?.status, isError, handleCancel]);

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

  //Hàm xác nhận ok khi thêm
  const onFinish = () => {
    const params = {
      TenMonAn: stateFood.TenMonAn,
      LoaiMonAn:
        stateFood.LoaiMonAn === "add_type"
          ? stateFood.newPhanLoai
          : stateFood.LoaiMonAn,
      HinhAnh: stateFood.HinhAnh,
      GiaMonAn: stateFood.GiaMonAn,
      DanhGia: stateFood.DanhGia,
      MoTa: stateFood.MoTa,
      GiamGia: stateFood.GiamGia,
    };
    mutation.mutate(params, {
      onSettled: () => {
        queryFood.refetch();
      },
    });
  };

  //hàm nhập dữ liệu cho từng thuộc tính
  // const handleOnchange = (e) => {
  //   const { name, value } = e.target;
  //   if (name in stateFood) {
  //     setStateFood((prevState) => ({
  //       ...prevState,
  //       [name]: value,
  //     }));
  //   } else if (name in stateFoodDetails) {
  //     setStateFoodDetails((prevState) => ({
  //       ...prevState,
  //       [name]: value,
  //     }));
  //   }
  // };

  const handleOnchange = (e) => {
    setStateFood({
      ...stateFood,
      [e.target.name]: e.target.value,
    });
  };

  //Hàm cancel Delete
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  //Hàm xác nhận xóa món ăn
  const handleDeleteFood = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryFood.refetch();
        },
      }
    );
  };

  //hàm chứa chi tiết món ăn
  const handleOnchangeDetails = (e) => {
    setStateFoodDetails({
      ...stateFoodDetails,
      [e.target.name]: e.target.value,
    });
  };

  //Hàm thay đổi hình ảnh món ăn
  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (file && !file.url && !file.preview) {
      file.preview = await getbase64(file.originFileObj);
    }
    setStateFood({
      ...stateFood,
      HinhAnh: file ? file.preview : null,
    });
  };

  //Hàm lấy hình ảnh chi tiết
  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (file && !file.url && !file.preview) {
      file.preview = await getbase64(file.originFileObj);
    }
    setStateFoodDetails({
      ...stateFoodDetails,
      HinhAnh: file ? file.preview : null,
    });
  };

  const onUpdateFoods = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateFoodDetails,
        // BanChay,
      },
      {
        onSettled: () => {
          queryFood.refetch();
        },
      }
    );
  };

  //Hàm lấy chi tiết món ăn từ API
  const fetchgetDetailsFood = async (rowSelected) => {
    const res = await FoodService.getDetailsFood(rowSelected);
    if (res?.data) {
      setStateFoodDetails({
        TenMonAn: res?.data?.TenMonAn,
        LoaiMonAn: res?.data?.LoaiMonAn,
        HinhAnh: res?.data?.HinhAnh,
        GiaMonAn: res?.data?.GiaMonAn,
        DanhGia: res?.data?.DanhGia,
        MoTa: res?.data?.MoTa,
        GiamGia: res?.data?.GiamGia,
        // BanChay: res?.data?.BanChay,
      });
      // setBanChay(res?.data?.BanChay);
    }
    // setisLoadingUpdate(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateFoodDetails);
    } else {
      form.setFieldsValue(inittial());
    }
  }, [form, stateFoodDetails, isModalOpen]);

  useEffect(() => {
    if (isOpenDrawer) {
      form.setFieldsValue(stateFoodDetails); // Set form values when the drawer opens
      // setBanChay(stateFoodDetails.BanChay);
    }
  }, [isOpenDrawer, stateFoodDetails, form]);

  // useEffect(() => {
  //   if (rowSelected) {
  //     fetchgetDetailsFood(rowSelected);
  //   }
  //   // setIsOpenDrawer(true);
  // }, [rowSelected]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      fetchgetDetailsFood(rowSelected);
    }
    // setIsOpenDrawer(true);
  }, [rowSelected, isOpenDrawer]);

  //Hàm lấy lấy chi tiết món ăn khi click vào món ăn
  const handleDetailsFood = () => {
    setLoadingDrawer(true);
    setIsOpenDrawer(true);
    setTimeout(() => {
      setLoadingDrawer(false);
    }, 1000);
  };

  const handleChangeSelect = (value) => {
    setStateFood({
      ...stateFood,
      LoaiMonAn: value,
    });
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
      title: <div style={{ textAlign: "center" }}>Tên món ăn</div>,
      dataIndex: "TenMonAn",
      width: "20%",
      responsive: ["lg"],
      sorter: (a, b) => a.TenMonAn.length - b.TenMonAn.length,
    },
    {
      title: <div style={{ textAlign: "center" }}>Mô tả</div>,
      dataIndex: "MoTa",
      width: "40%",
      responsive: ["lg"],
    },

    {
      title: <div style={{ textAlign: "center" }}>Giá món ăn</div>,
      dataIndex: "GiaMonAn",
      width: "10%",
      align: "center",
      responsive: ["md"],
    },

    // {
    //   title: <div style={{ textAlign: "center" }}>Bán chạy</div>,
    //   dataIndex: "BanChay",
    //   width: "10%",
    //   align: "center",
    //   responsive: ["md"],
    // },

    {
      title: <div style={{ textAlign: "center" }}>Phân loại</div>,
      dataIndex: "LoaiMonAn",
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
    foods?.data?.length &&
    foods?.data?.map((food) => {
      return {
        ...food,
        key: food._id,
        GiaMonAn: converPrice(food.GiaMonAn),
        MoTa: truncateDescription(food.MoTa, 100),
        GiamGia: food.GiamGia,
        // BanChay: food.BanChay ? "Bán chạy" : "Bình thường",
      };
    });

  const openAddFoodModal = () => {
    setStateFood(inittial()); // Reset to initial state when opening the modal
    setIsModalOpen(true);
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#FFF7E4" }}>
      <SiderComponent collapsed={collapsed} user={user} selectKey={"2"} />
      <Layout
        style={{
          minHeight: "750px",
          marginLeft: marginLeft,
          transition: "margin-left 0.3s ease",
          backgroundColor: "#FFF7E4",
        }}
      >
        <Header
          style={{
            padding: "0 16px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            style={{ fontSize: "20px" }}
          />
          <Text strong style={{ fontSize: 22 }}>
            QUẢN LÝ THỨC ĂN
          </Text>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            // onClick={() => setIsModalOpen(true)}
            onClick={openAddFoodModal}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "40px",
              fontSize: "16px",
              backgroundColor: "#FF6F00",
              border: "none",
            }}
          >
            Thêm mới
          </Button>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Loading isLoading={isLoadingFood}>
            <TableComponent
              columns={columns}
              isLoading={isLoadingFood}
              pagination={{
                position: ["bottomCenter"],
                pageSize: 6,
              }}
              data={dataTable}
              onRow={(record) => ({
                onClick: () => setRowSelected(record._id),
              })}
            />
          </Loading>
        </Content>
        <ModalComponent
          forceRender
          title={
            <Text style={{ fontSize: "20px", fontWeight: "bold" }}>
              Thêm món ăn
            </Text>
          }
          open={isModalOpen}
          footer={null}
          onCancel={handleCancel}
        >
          <Loading isLoading={isLoading}>
            <Form
              name="addFood"
              layout="vertical"
              onFinish={onFinish}
              autoComplete="on"
              form={form}
              style={{
                maxWidth: "100%",
              }}
            >
              <Form.Item
                label="Tên món ăn"
                name="TenMonAn"
                rules={[{ required: true, message: "Hãy nhập tên món ăn!" }]}
              >
                <InputComponent
                  value={stateFood.TenMonAn}
                  onChange={handleOnchange}
                  name="TenMonAn"
                />
              </Form.Item>
              <Form.Item
                label="Mô tả món ăn"
                name="MoTa"
                rules={[
                  { required: true, message: "Hãy nhập mô tả của món ăn!" },
                ]}
              >
                <TextArea
                  rows={4}
                  value={stateFood.MoTa}
                  onChange={handleOnchange}
                  name="MoTa"
                />
              </Form.Item>
              <Form.Item
                label="Phân loại "
                name="LoaiMonAn"
                rules={[
                  {
                    required: true,
                    message: "Hãy phân loại món ăn!",
                  },
                ]}
              >
                <Select
                  name="LoaiMonAn"
                  value={stateFood.LoaiMonAn}
                  onChange={handleChangeSelect}
                  options={renderOptions(typeFood?.data?.data)}
                />
              </Form.Item>
              {stateFood.LoaiMonAn === "add_type" && (
                <Form.Item
                  label="Thêm phân loại"
                  name="newPhanLoai"
                  rules={[
                    {
                      required: true,
                      message: "Hãy phân loại món ăn!",
                    },
                  ]}
                >
                  <InputComponent
                    value={stateFood.newPhanLoai}
                    onChange={handleOnchange}
                    name="newPhanLoai"
                  />
                </Form.Item>
              )}
              <Form.Item
                label="Giá món ăn"
                name="GiaMonAn"
                rules={[
                  {
                    required: true,
                    message: "Hãy ra giá món ăn!",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  step={1000}
                  prefix={<DollarOutlined />}
                  value={stateFood.GiaMonAn}
                  formatter={(value) =>
                    ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  onChange={(value) =>
                    handleOnchange({ target: { name: "GiaMonAn", value } })
                  }
                  name="GiaMonAn"
                  style={{ width: "100%" }}
                />
                {/* <InputComponent
                    value={stateFood.GiaMonAn}
                    onChange={handleOnchange}
                    name="GiaMonAn"
                  /> */}
              </Form.Item>

              <Form.Item
                label="Giảm giá"
                name="GiamGia"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập giảm giá cho món ăn!",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  step={1000}
                  prefix={<PercentageOutlined />}
                  value={stateFood.GiamGia}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  onChange={(value) =>
                    handleOnchange({ target: { name: "GiamGia", value } })
                  }
                  name="GiamGia"
                  style={{ width: "100%" }}
                />
                {/* <InputComponent
                    value={stateFood.GiamGia}
                    onChange={handleOnchange}
                    name="GiamGia"
                  /> */}
              </Form.Item>

              <Form.Item
                label="Đánh giá"
                name="DanhGia"
                rules={[
                  {
                    required: true,
                    message: "Hãy đánh giá món ăn!",
                  },
                ]}
              >
                <InputComponent
                  value={stateFood.DanhGia}
                  onChange={handleOnchange}
                  name="DanhGia"
                />
              </Form.Item>

              <Form.Item
                label="Ảnh món ăn"
                name="HinhAnh"
                rules={[
                  {
                    required: true,
                    message: "Hãy thêm hình ảnh cho món ăn!",
                  },
                ]}
              >
                <Upload
                  maxCount={1}
                  className="ant-upload-list-item-name"
                  onChange={handleOnchangeAvatar}
                  showUploadList={false}
                  fileList={
                    stateFood.HinhAnh
                      ? [{ uid: "-1", url: stateFood.HinhAnh }]
                      : []
                  }
                >
                  <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                </Upload>
                {stateFood?.HinhAnh && (
                  <Image
                    src={stateFood?.HinhAnh}
                    alt="Ảnh đại diện"
                    style={{
                      height: "60px",
                      width: "60px",
                      marginLeft: "10px",
                      borderRadius: "10%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </Form.Item>

              <Form.Item wrapperCol={{ span: 24 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: "100%",
                    backgroundColor: "#FF6F00",
                    border: "none",
                  }}
                >
                  Thêm mới
                </Button>
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
        <Drawer
          title="Cập nhật Món ăn"
          onClose={onClose}
          open={isOpenDrawer}
          loading={loadingDrawer}
          width="40%"
        >
          <Loading isLoading={isLoadingFood}>
            <Form
              name="updateFood"
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
              style={{
                maxWidth: 600,
              }}
              onFinish={onUpdateFoods}
              autoComplete="on"
              form={form}
            >
              <Form.Item
                label="Tên món ăn"
                name="TenMonAn"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập tên món ăn!",
                  },
                ]}
              >
                <InputComponent
                  value={stateFoodDetails.TenMonAn}
                  onChange={handleOnchangeDetails}
                  name="TenMonAn"
                />
              </Form.Item>

              <Form.Item
                label="Mô tả món ăn"
                name="MoTa"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập mô tả của món ăn!",
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  value={stateFoodDetails.MoTa}
                  onChange={handleOnchangeDetails}
                  name="MoTa"
                />
              </Form.Item>

              <Form.Item
                label="Phân loại "
                name="LoaiMonAn"
                rules={[
                  {
                    required: true,
                    message: "Hãy phân loại món ăn!",
                  },
                ]}
              >
                <InputComponent
                  value={stateFoodDetails.LoaiMonAn}
                  onChange={handleOnchangeDetails}
                  name="LoaiMonAn"
                />
              </Form.Item>

              <Form.Item
                label="Giá món ăn"
                name="GiaMonAn"
                rules={[
                  {
                    required: true,
                    message: "Hãy ra giá món ăn!",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  step={1000}
                  prefix={<DollarOutlined />}
                  value={stateFoodDetails.GiaMonAn}
                  formatter={(value) =>
                    ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  onChange={(value) =>
                    setStateFoodDetails((prevState) => ({
                      ...prevState,
                      GiaMonAn: value,
                    }))
                  }
                  name="GiaMonAn"
                  style={{ width: "100%" }}
                />
                {/* <InputComponent
                    value={stateFoodDetails.GiaMonAn}
                    onChange={handleOnchangeDetails}
                    name="GiaMonAn"
                  /> */}
              </Form.Item>

              <Form.Item
                label="Giảm giá"
                name="GiamGia"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập giảm giá cho món ăn!",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  step={1000}
                  prefix={<PercentageOutlined />}
                  value={stateFoodDetails.GiamGia}
                  formatter={(value) =>
                    ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  onChange={(value) =>
                    setStateFoodDetails((prevState) => ({
                      ...prevState,
                      GiamGia: value,
                    }))
                  }
                  name="GiaMonAn"
                  style={{ width: "100%" }}
                />
                {/* <InputComponent
                    value={stateFoodDetails.GiamGia}
                    onChange={handleOnchangeDetails}
                    name="GiamGia"
                  /> */}
              </Form.Item>

              <Form.Item
                label="Đánh giá"
                name="DanhGia"
                rules={[
                  {
                    required: true,
                    message: "Hãy đánh giá món ăn!",
                  },
                ]}
              >
                <InputComponent
                  value={stateFoodDetails.DanhGia}
                  onChange={handleOnchangeDetails}
                  name="DanhGia"
                />
              </Form.Item>

              {/* <Form.Item label="BanChay">
                  <Switch checked={BanChay} onChange={handleSwitchChange} />
                  <Typography.Text style={{ marginLeft: 8 }}>
                    {stateFoodDetails.BanChay ? "Bán chạy" : "Bình thường"}
                  </Typography.Text>
                </Form.Item> */}

              <Form.Item
                label="Ảnh món ăn"
                name="HinhAnh"
                rules={[
                  {
                    required: true,
                    message: "Hãy thêm hình ảnh cho món ăn!",
                  },
                ]}
              >
                <div>
                  <Upload
                    maxCount={1}
                    className="ant-upload-list-item-name"
                    onChange={handleOnchangeAvatarDetails}
                    showUploadList={false}
                    ileList={
                      stateFoodDetails.HinhAnh
                        ? [{ uid: "-1", url: stateFoodDetails.HinhAnh }]
                        : []
                    }
                  >
                    <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                  </Upload>
                  {stateFoodDetails?.HinhAnh && (
                    <Image
                      src={stateFoodDetails?.HinhAnh}
                      alt="Ảnh đại diện"
                      style={{
                        height: "60px",
                        width: "60px",
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
          title="Xóa món ăn"
          open={isModalOpenDelete}
          onCancel={handleCancelDelete}
          onOk={handleDeleteFood}
        >
          <div>Bạn có chắc xóa món {stateFoodDetails.TenMonAn} này không</div>
        </ModalComponent>
      </Layout>
    </Layout>
  );
};

export default FoodAdmin;
