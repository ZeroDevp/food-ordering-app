import React, { useCallback, useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Form, Image, Layout, Modal, theme, Upload } from "antd";
import SiderComponent from "../../../components/SiderComponent/SiderComponent";
import { useSelector } from "react-redux";
import InputComponent from "../../../components/InputComponent/InputComponent";
import { converPrice, getbase64, truncateDescription } from "../../../utils";
import * as FoodService from "../../../service/FoodService";
import { useMutationHooks } from "../../../hook/useMutationHook";
import Loading from "../../../components/LoadingComponent/Loading";
import * as Message from "../../../components/Message/Message";
import TableComponent from "../../../components/TableComponent/TableComponent";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

const { Header, Content } = Layout;

const FoodAdmin = () => {
  const [rowSelected, setRowSelected] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector((state) => state?.user);
  const [marginLeft, setMarginLeft] = useState(280);
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();

  const [stateFood, setStateFood] = useState({
    TenMonAn: "",
    LoaiMonAn: "",
    HinhAnh: null,
    GiaMonAn: "",
    DanhGia: "",
    MoTa: "",
  });

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
    const { TenMonAn, LoaiMonAn, HinhAnh, GiaMonAn, DanhGia, MoTa } = data;
    const res = FoodService.createFood({
      TenMonAn,
      LoaiMonAn,
      HinhAnh,
      GiaMonAn,
      DanhGia,
      MoTa,
    });
    return res;
  });

  //Hàm getAllFood từ API
  const getAllFood = async () => {
    const res = await FoodService.getAllFood();
    return res;
  };

  const { data, isLoading, isSuccess, isError } = mutation;
  const { isLoading: isLoadingFood, data: foods } = useQuery({
    queryKey: ["foods"],
    queryFn: getAllFood,
  });
  console.log("foods", foods);

  //Hàm cancel khi 0 muốn tạo món ăn
  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setStateFood({
      TenMonAn: "",
      LoaiMonAn: "",
      HinhAnh: null,
      GiaMonAn: "",
      DanhGia: "",
      MoTa: "",
    });
    form.resetFields();
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

  //Hàm xác nhận ok khi thêm
  const onFinish = () => {
    mutation.mutate(stateFood);
    console.log("finish", stateFood);
  };

  //hàm nhập dữ liệu cho từng thuộc tính
  const handleOnchange = (e) => {
    setStateFood({
      ...stateFood,
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
        <FontAwesomeIcon icon={faPenToSquare} />
        <FontAwesomeIcon icon={faTrash} />
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
    {
      title: <div style={{ textAlign: "center" }}>Phân loại</div>,
      dataIndex: "LoaiMonAn",
      width: "10%",
      responsive: ["lg"],
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
    foods?.data?.map((foods) => {
      return {
        ...foods,
        key: foods._id,
        price: converPrice(foods.GiaMonAn),
        description: truncateDescription(foods.MoTa, 100),
      };
    });

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#FEE4CC" }}>
      <SiderComponent collapsed={collapsed} user={user} selectKey={"2"} />
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
          <h5
            style={{
              display: "inline-block",
              marginLeft: "20px",
            }}
          >
            QUẢN LÝ THỨC ĂN
          </h5>
          <Button
            type="text"
            icon={<PlusOutlined style={{ fontSize: "30px", color: "green" }} />}
            className="btn btn-default"
            onClick={() => setIsModalOpen(true)}
            style={{
              width: 64,
              height: 64,
              float: "right",
              marginRight: 50,
              marginTop: 20,
            }}
          />
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
          <TableComponent
            columns={columns}
            isLoading={isLoadingFood}
            pagination={{
              position: ["bottomCenter"],
              pageSize: 5,
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

          <Modal
            title="Thêm Mới món ăn"
            open={isModalOpen}
            footer={null}
            onCancel={handleCancel}
          >
            <Loading isLoading={isLoading}>
              <Form
                name="basic"
                labelCol={{
                  span: 6,
                }}
                wrapperCol={{
                  span: 18,
                }}
                style={{
                  maxWidth: 600,
                }}
                onFinish={onFinish}
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
                    value={stateFood.TenMonAn}
                    onChange={handleOnchange}
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
                  <InputComponent
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
                  <InputComponent
                    value={stateFood.LoaiMonAn}
                    onChange={handleOnchange}
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
                  <InputComponent
                    value={stateFood.GiaMonAn}
                    onChange={handleOnchange}
                    name="GiaMonAn"
                  />
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

                <Form.Item wrapperCol={{ offset: 16, span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
                    Cancel
                  </Button>
                </Form.Item>
              </Form>
            </Loading>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default FoodAdmin;
