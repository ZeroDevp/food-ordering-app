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
import Dashboard from "../pages/SystemManager/AdminPage/DashBoard";
import FoodAdmin from "../pages/SystemManager/AdminPage/FoodAdmin";
import UserAdmin from "../pages/SystemManager/AdminPage/UserAdmin";
import OrderAdmin from "../pages/SystemManager/AdminPage/OrderAdmin";
import FoodType from "../pages/Productpage/FoodType";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import DetailsOrderPage from "../pages/Profile/DetailsOrderPage";
import OrderDetailsAdmin from "../pages/SystemManager/AdminPage/OrderDetailsAdmin";
import BlogAdmin from "../pages/SystemManager/AdminPage/BlogAdmin";
import BlogDetails from "../pages/BlogDetails/BlogDetails";

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

    //Trang food Type
    {
        path: "/Product/:LoaiMonAn",
        page: FoodType,
        isShowheader: true,
    },

    //trang chi tiet SP
    {
        path: "/Product/ProductDetail/:id",
        page: ProductDetail,
        isShowheader: true,
    },

    //trang order
    {
        path: "/Order",
        page: OrderPage,
        isShowheader: true,
    },

    //Trang Payment
    {
        path: "/Payment",
        page: PaymentPage,
        isShowheader: true,
    },

    //Trang OrderSuccess
    {
        path: "/OrderSuccess",
        page: OrderSuccess,
        isShowheader: true,
    },

    //trang bai viet
    {
        path: "/Blog",
        page: Blog,
        isShowheader: true,
    },

    //trang chi tiet bai viet
    {
        path: "/Blog/BlogDetails/:id",
        page: BlogDetails,
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

    //Trang chi tiết đơn hàng
    {
        path: "/details-order/:id",
        page: DetailsOrderPage,
        isShowheader: true,
    },

    //Trang DashBoard
    {
        path: "/system/Admin",
        page: Dashboard,
        isShowheader: false,
        isPrivate: true
    },

    //Trang QL Food
    {
        path: "/system/FoodAdmin",
        page: FoodAdmin,
        isShowheader: false,
        isPrivate: true
    },

    //Trang chi tiết đơn hàng
    {
        path: "/system/AdminOrderDetails/:id",
        page: OrderDetailsAdmin,
        isShowheader: false,
        isPrivate: true
    },

    //Trang QL User
    {
        path: "/system/UserAdmin",
        page: UserAdmin,
        isShowheader: false,
        isPrivate: true
    },

    //Trang QL Order
    {
        path: "/system/OrderAdmin",
        page: OrderAdmin,
        isShowheader: false,
        isPrivate: true
    },

    //Trang QL Blogs
    {
        path: "/system/BlogAdmin",
        page: BlogAdmin,
        isShowheader: false,
        isPrivate: true
    },


    // 404
    {
        path: "*",
        page: NotFoundPage
    }
];