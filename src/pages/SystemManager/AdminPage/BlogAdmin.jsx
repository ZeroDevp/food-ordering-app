import {
  Button,
  Drawer,
  Form,
  Image,
  Layout,
  Switch,
  theme,
  Typography,
  Upload,
} from "antd";
import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useMutationHooks } from "../../../hook/useMutationHook";
import * as BlogService from "../../../service/BlogService";
import { useQuery } from "@tanstack/react-query";
import * as Message from "../../../components/Message/Message";
import { getbase64, truncateDescription } from "../../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import SiderComponent from "../../../components/SiderComponent/SiderComponent";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Loading from "../../../components/LoadingComponent/Loading";
import TableComponent from "../../../components/TableComponent/TableComponent";
import ModalComponent from "../../../components/ModalComponent/ModalComponent";
import InputComponent from "../../../components/InputComponent/InputComponent";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import { Editor, EditorState } from "draft-js";
// import "draft-js/dist/Draft.css";

const BlogAdmin = () => {
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [loadingDrawer, setLoadingDrawer] = useState(true);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector((state) => state?.user);
  const [marginLeft, setMarginLeft] = useState(80);
  const [collapsed, setCollapsed] = useState(true);
  const [tinNoiBat, setTinNoiBat] = useState(false);
  const { Header, Content } = Layout;
  const { Title, Text } = Typography;
  const [form] = Form.useForm();

  const inittial = () => ({
    tieuDe: "",
    hinhAnh: "",
    noiDung: "",
    noiDungTomTat: "",
    tinNoiBat: false,
  });

  const [stateBlog, setStateBlog] = useState(inittial());
  const [stateBlogDetails, setStateBlogDetails] = useState(inittial());

  //hàm đóng mở sidebar
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setMarginLeft(collapsed ? 280 : 80);
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  //fnc call API Create Blogs
  const mutation = useMutationHooks((data) => {
    const { tieuDe, hinhAnh, noiDung, noiDungTomTat } = data;
    const res = BlogService.createBlog({
      tieuDe,
      hinhAnh,
      noiDung,
      noiDungTomTat,
    });
    return res;
  });

  //fuc Update Blog
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = BlogService.updateBlog(id, token, {
      ...rests,
    });
    return res;
  });

  //fnc Delete Blog
  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    const res = BlogService.deleteBlog(id, token);
    return res;
  });

  //fnc GetAllBlogs
  const getAllBlog = async () => {
    const res = await BlogService.getAllBlog();
    return res;
  };

  //fnc Notification create blog success
  const { data, isLoading, isSuccess, isError } = mutation;

  //fnc Notification update blog success
  const {
    data: dataUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;

  //fnc Notification delete blog success
  const {
    data: dataDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDelete;

  //fnc query getAllFood
  const queryBlog = useQuery({
    queryKey: ["blogs"],
    queryFn: getAllBlog,
  });

  const { isLoading: isLoadingBlog, data: blogs } = queryBlog;

  //fnc cancel create blog
  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setStateBlog({
      tieuDe: "",
      hinhAnh: null,
      noiDung: "",
      noiDungTomTat: "",
      tinNoiBat: false,
    });
    form.resetFields();
  }, [form]);

  //fnc close drawer
  const handleCloseDrawer = useCallback(() => {
    setIsOpenDrawer(false);
  }, []);

  //Hàm cancel Delete
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  //event create successfull blog
  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      Message.success("Tạo bài viết thành công");
      handleCancel();
    } else if (isError) {
      Message.error("Tạo bài viết không thành công");
    }
  }, [isSuccess, isError, handleCancel, data?.status]);

  //event update successfull blog
  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      Message.success("Cập nhật bài viết thành công");
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      Message.error("Cập nhật bài viết không thành công");
    }
  }, [
    isSuccessUpdated,
    isErrorUpdated,
    handleCloseDrawer,
    dataUpdated?.status,
  ]);

  //event delete successfull blog
  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      Message.success("Xóa bài viết thành công");
      handleCancelDelete();
    } else if (isErrorDeleted) {
      Message.error("Xoá bài viết không thành công");
    }
  }, [isSuccessDeleted, isErrorDeleted, dataDeleted?.status]);

  const onClose = () => {
    setIsOpenDrawer(false);
  };

  //fnc confirm OK after add
  const onFinish = () => {
    const param = {
      tieuDe: stateBlog.tieuDe,
      hinhAnh: stateBlog.hinhAnh,
      noiDung: stateBlog.noiDung,
      noiDungTomTat: stateBlog.noiDungTomTat,
    };
    mutation.mutate(param, {
      onSettled: () => {
        queryBlog.refetch();
      },
    });
  };

  //fnc enter for attributes
  // const handleOnChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name in stateBlog) {
  //     setStateBlog((prevState) => ({
  //       ...prevState,
  //       [name]: value,
  //     }));
  //   } else if (name in stateBlogDetails) {
  //     setStateBlogDetails((prevState) => ({
  //       ...prevState,
  //       [name]: value,
  //     }));
  //   }
  // };

  const handleOnChange = (e, fieldName) => {
    if (fieldName) {
      setStateBlog((prevState) => ({
        ...prevState,
        [fieldName]: e,
      }));
    } else {
      const { name, value } = e.target;
      if (name in stateBlog) {
        setStateBlog((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    }
  };

  //fnc details blog

  // const handleOnChangeDetails = (e) => {
  //   setStateBlogDetails({
  //     ...stateBlogDetails,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const handleOnChangeDetails = (e, name) => {
    if (name) {
      // Xử lý cho ReactQuill hoặc khi trường được truyền bằng name
      setStateBlogDetails((prevState) => ({
        ...prevState,
        [name]: e, // e ở đây là giá trị từ ReactQuill
      }));
    } else {
      // Xử lý cho các input thông thường
      const { name: inputName, value } = e.target;
      setStateBlogDetails((prevState) => ({
        ...prevState,
        [inputName]: value,
      }));
    }
  };
  //   const handleOnChangeDetails = (e, name) => {
  //     if (typeof value === "string") {
  //       // Xử lý ReactQuill (truyền nội dung text và name)
  //       setStateBlogDetails({
  //         ...stateBlogDetails,
  //         [name]: e,
  //       });
  //     } else {
  //       // Xử lý các input thông thường
  //       setStateBlogDetails({
  //         ...stateBlogDetails,
  //         [e.target.name]: e.target.value,
  //       });
  //     }
  //   };

  const handleDeleteBlog = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryBlog.refetch();
        },
      }
    );
  };

  //fnc change Image Blog
  // const handleOnChangeImage = async ({ fileList }) => {
  //   const file = fileList[0];
  //   if (file && !file.url && !file.preview) {
  //     file.preview = await getbase64(file.originFileObj);
  //   }
  //   setStateBlog({
  //     ...stateBlog,
  //     hinhAnh: file ? file.preview : null,
  //   });
  // };

  const handleOnChangeImage = async ({ fileList }) => {
    const file = fileList[0];
    let preview = null;
    if (file && !file.url && !file.preview) {
      preview = await getbase64(file.originFileObj);
    }
    // Cập nhật giá trị trực tiếp vào Form
    form.setFieldsValue({
      hinhAnh: preview,
    });
    // Cập nhật vào state nếu cần dùng ở nơi khác
    setStateBlog({
      ...stateBlog,
      hinhAnh: preview,
    });
  };

  //fnc details image
  const handleOnChangeImageDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (file && !file.url && !file.preview) {
      file.preview = await getbase64(file.originFileObj);
    }
    setStateBlogDetails({
      ...stateBlogDetails,
      hinhAnh: file ? file.preview : null,
    });
  };

  //fnc updateBlog
  const onUpdateBlogs = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateBlogDetails,
        tinNoiBat,
      },
      {
        onSettled: () => {
          queryBlog.refetch();
        },
      }
    );
  };

  //fnc getDetail Blog
  const fetchGetDetailsBlog = async (rowSelected) => {
    const res = await BlogService.getDetailsBlog(rowSelected);
    if (res?.data) {
      setStateBlogDetails({
        tieuDe: res?.data?.tieuDe,
        hinhAnh: res?.data?.hinhAnh,
        noiDung: res?.data?.noiDung,
        noiDungTomTat: res?.data?.noiDungTomTat,
        tinNoiBat: res?.data?.tinNoiBat,
      });
      setTinNoiBat(res?.data?.tinNoiBat);
    }
  };

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateBlogDetails);
    } else {
      form.setFieldsValue(inittial());
    }
  }, [form, stateBlogDetails, isModalOpen]);

  useEffect(() => {
    if (isOpenDrawer) {
      form.setFieldsValue(stateBlogDetails);
      setTinNoiBat(stateBlogDetails.tinNoiBat);
    }
  }, [isOpenDrawer, stateBlogDetails, form]);

  const handleSwitchChange = (checked) => {
    setTinNoiBat(checked);
    setStateBlogDetails((prevState) => ({
      ...prevState,
      tinNoiBat: checked,
    }));
  };

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsBlog(rowSelected);
    }
  }, [rowSelected]);

  const handleDetailsBlog = () => {
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
          <FontAwesomeIcon icon={faPenToSquare} onClick={handleDetailsBlog} />
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
      title: <div style={{ textAlign: "center" }}>Tiêu đề</div>,
      dataIndex: "tieuDe",
      width: "30%",
      responsive: ["lg"],
      sorter: (a, b) => a.tieuDe.length - b.tieuDe.length,
    },
    {
      title: <div style={{ textAlign: "center" }}>Nội dung</div>,
      dataIndex: "noiDung",
      width: "30%",
      responsive: ["lg"],
      render: (text) => (
        <div
          style={{ textAlign: "left" }}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      ),
    },

    {
      title: <div style={{ textAlign: "center" }}>Tin nổi bật</div>,
      dataIndex: "tinNoiBat",
      width: "30%",
      align: "center",
      responsive: ["md"],
    },

    {
      title: <div style={{ textAlign: "center" }}>Chức năng</div>,
      dataIndex: "Action",
      width: "30%",
      responsive: ["md"],

      render: renderAction,
    },
  ];

  const dataTable =
    blogs?.data?.length &&
    blogs?.data?.map((blog) => {
      return {
        ...blog,
        key: blog._id,
        tinNoiBat: blog.tinNoiBat ? "Nổi bật" : "Bình thường",
        noiDung: truncateDescription(blog.noiDung, 100),
      };
    });

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#FFF7E4" }}>
      <SiderComponent collapsed={collapsed} user={user} selectKey={"5"} />
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
            QUẢN LÝ BÀI VIẾT
          </Text>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
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
          <Loading isLoading={isLoadingBlog}>
            <TableComponent
              columns={columns}
              isLoading={isLoadingBlog}
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
              Thêm bài viết
            </Text>
          }
          open={isModalOpen}
          footer={null}
          onCancel={handleCancel}
        >
          <Loading isLoading={isLoading}>
            <Form
              name="addBlog"
              layout="vertical"
              onFinish={onFinish}
              autoComplete="on"
              form={form}
              style={{
                maxWidth: "100%",
              }}
            >
              <Form.Item
                label="Tiêu đề"
                name="tieuDe"
                rules={[{ required: true, message: "Hãy nhập tên tiêu đề!" }]}
              >
                <InputComponent
                  value={stateBlog.tieuDe}
                  onChange={handleOnChange}
                  name="tieuDe"
                />
              </Form.Item>

              <Form.Item
                label="Nội dung tóm tắt"
                name="noiDungTomTat"
                rules={[
                  { required: true, message: "Hãy nhập tên nội dung tóm tắt!" },
                ]}
              >
                <InputComponent
                  value={stateBlog.noiDungTomTat}
                  onChange={handleOnChange}
                  name="noiDungTomTat"
                />
              </Form.Item>

              <Form.Item
                label="Ảnh bài viết"
                name="hinhAnh"
                rules={[
                  {
                    required: true,
                    message: "Hãy thêm hình ảnh cho bài viết!",
                  },
                ]}
              >
                <Upload
                  maxCount={1}
                  className="ant-upload-list-item-name"
                  onChange={handleOnChangeImage}
                  showUploadList={false}
                  fileList={
                    stateBlog.hinhAnh
                      ? [{ uid: "-1", url: stateBlog.hinhAnh }]
                      : []
                  }
                >
                  <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                </Upload>
                {stateBlog?.hinhAnh && (
                  <Image
                    src={stateBlog?.hinhAnh}
                    alt="Ảnh bài viết"
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
                label="Nội dung"
                name="noiDung"
                rules={[{ required: true, message: "Hãy nhập nội dung!" }]}
              >
                <ReactQuill
                  value={stateBlog.noiDung}
                  onChange={(value) => handleOnChange(value, "noiDung")}
                  placeholder="Nhập nội dung ở đây..."
                  style={{ height: "100%", minHeight: "300px" }}
                />
                {/* <InputComponent
                  value={stateBlog.noiDung}
                  onChange={handleOnChange}
                  name="noiDung"
                /> */}
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
          title="Cập nhật Bài viết"
          onClose={onClose}
          open={isOpenDrawer}
          loading={loadingDrawer}
          width="40%"
        >
          <Loading isLoading={isLoadingBlog}>
            <Form
              name="updateBlogs"
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
              style={{
                maxWidth: 600,
              }}
              onFinish={onUpdateBlogs}
              autoComplete="on"
              form={form}
            >
              <Form.Item
                label="Tiêu đề"
                name="tieuDe"
                rules={[{ required: true, message: "Hãy nhập tên tiêu đề!" }]}
              >
                <InputComponent
                  value={stateBlogDetails.tieuDe}
                  onChange={handleOnChangeDetails}
                  name="tieuDe"
                />
              </Form.Item>

              <Form.Item
                label="Nội dung tóm tắt"
                name="noiDungTomTat"
                rules={[
                  { required: true, message: "Hãy nhập tên nội dung tóm tắt!" },
                ]}
              >
                <InputComponent
                  value={stateBlogDetails.noiDungTomTat}
                  onChange={handleOnChangeDetails}
                  name="noiDungTomTat"
                />
              </Form.Item>

              <Form.Item label="Tin nổi bật">
                <Switch checked={tinNoiBat} onChange={handleSwitchChange} />
                <Typography.Text style={{ marginLeft: 8 }}>
                  {stateBlogDetails.tinNoiBat ? "Nổi bật" : "Bình thường"}
                </Typography.Text>
              </Form.Item>

              <Form.Item
                label="Ảnh bài viết"
                name="hinhAnh"
                rules={[
                  {
                    required: true,
                    message: "Hãy thêm hình ảnh cho bài viết!",
                  },
                ]}
              >
                <Upload
                  maxCount={1}
                  className="ant-upload-list-item-name"
                  onChange={handleOnChangeImageDetails}
                  showUploadList={false}
                  fileList={
                    stateBlogDetails.hinhAnh
                      ? [{ uid: "-1", url: stateBlogDetails.hinhAnh }]
                      : []
                  }
                >
                  <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                </Upload>
                {stateBlogDetails?.hinhAnh && (
                  <Image
                    src={stateBlogDetails?.hinhAnh}
                    alt="Ảnh bài viết"
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
                label="Nội dung"
                name="noiDung"
                rules={[{ required: true, message: "Hãy nhập nội dung!" }]}
              >
                <ReactQuill
                  value={stateBlogDetails.noiDung}
                  onChange={(value) => handleOnChangeDetails(value, "noiDung")}
                  placeholder="Nhập nội dung ở đây..."
                  style={{ height: "100%", minHeight: "300px" }}
                />
                {/* <InputComponent
                  value={stateBlogDetails.noiDung}
                  onChange={handleOnChangeDetails}
                  name="noiDung"
                /> */}
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
          title="Xóa bài viết"
          open={isModalOpenDelete}
          onCancel={handleCancelDelete}
          onOk={handleDeleteBlog}
        >
          <div>Bạn có chắc xóa bài {stateBlogDetails.tieuDe} này không</div>
        </ModalComponent>
      </Layout>
    </Layout>
  );
};

export default BlogAdmin;
