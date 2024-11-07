import Blog from "../pages/Blog/blog";
import contact from "../pages/Contact/contact";
import HomePage from "../pages/Homepage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/notFoundPage";
import OrderPage from "../pages/Orderpage/OrderPage";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import ProductPage from "../pages/Productpage/ProductPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import MyOrderPage from "../pages/Profile/MyOrderPage";
import SignIn from "../pages/SignIn/SignIn";
import SignUp from "../pages/SignUp/SignUp";
import AdminPage from "../pages/SystemManager/AdminPage/AdminPage";

export const routes = [

    // trang chu
    {
        path: "/",
        page: HomePage,
        isShowheader: true,
    },

    //trang product
    {
        path: "/Product",
        page: ProductPage,
        isShowheader: true,
    },

    //trang chi tiet SP
    {
        path: "/Product/ProductDetail",
        page: ProductDetail,
        isShowheader: true,
    },

    //trang order
    {
        path: "/Order",
        page: OrderPage,
        isShowheader: true,
    },

    //trang tin tuc
    {
        path: "/Blog",
        page: Blog,
        isShowheader: true,
    },

    //trang lien he
    {
        path: "/Contact",
        page: contact,
        isShowheader: true,
    },

    //trang Dang Nhap
    {
        path: "/SignIn",
        page: SignIn,
        isShowheader: false,
    },

    //Trang Dang ky
    {
        path: "/SignUp",
        page: SignUp,
        isShowheader: false,
    },

    //Trang thong tin nguoi dung
    {
        path: "/Profile-User",
        page: ProfilePage,
        isShowheader: true,
    },

    //Trang Thông tin đơn hàng của người dùng
    {
        path: "/my-order",
        page: MyOrderPage,
        isShowheader: true,
    },

    //Trang quản trị hệ thống
    {
        path: "/system/Admin",
        page: AdminPage,
        isShowheader: false,
        isPrivate: true
    },

    // 404
    {
        path: "*",
        page: NotFoundPage
    }
];