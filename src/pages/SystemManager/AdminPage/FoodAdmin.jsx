import React, { useEffect, useState } from "react";
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
import { getbase64 } from "../../../utils";
import * as FoodService from "../../../service/FoodService";
import { useMutationHooks } from "../../../hook/useMutationHook";
import Loading from "../../../components/LoadingComponent/Loading";
import * as Message from "../../../components/Message/Message";

const { Header, Content } = Layout;

const FoodAdmin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector((state) => state?.user);
  const [marginLeft, setMarginLeft] = useState(280);
  const [collapsed, setCollapsed] = useState(false);

  const [stateFood, setStateFood] = useState({
    TenMonAn: "",
    LoaiMonAn: "",
    HinhAnh: null,
    GiaMonAn: "",
    DanhGia: "",
    MoTa: "",
  });

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

  const { data, isLoading, isSuccess, isError } = mutation;
  console.log("dataa", data);
  //Xử lý sự kiện khi thêm món ăn thành công
  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      Message.success();
      handleCancel();
    } else if (isError) {
      Message.error();
    }
  }, [isSuccess, data?.status, isError]);

  // const handleOk = () => {
  //   onFinish();
  // };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateFood({
      TenMonAn: "",
      LoaiMonAn: "",
      HinhAnh: null,
      GiaMonAn: "",
      DanhGia: "",
      MoTa: "",
    });
  };

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
                  span: 8,
                }}
                wrapperCol={{
                  span: 16,
                }}
                style={{
                  maxWidth: 600,
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                autoComplete="off"
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
                  label="Phân loại món ăn"
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
                  label="Đánh giá món ăn"
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

                <Form.Item
                  wrapperCol={{
                    offset: 8,
                    span: 16,
                  }}
                >
                  <Button type="primary" htmlType="submit">
                    Submit
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
