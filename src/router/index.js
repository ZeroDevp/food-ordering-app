import Blog from "../pages/Blog/blog";
import contact from "../pages/Contact/contact";
import HomePage from "../pages/Homepage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/notFoundPage";
import OrderPage from "../pages/Orderpage/OrderPage";
import ProductPage from "../pages/Productpage/ProductPage";

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

    //trang order
    {
        path: "/Order",
        page: OrderPage,
        isShowheader: true,
    },

    {
        path: "/Blog",
        page: Blog,
        isShowheader: true,
    },

    {
        path: "/Contact",
        page: contact,
        isShowheader: true,
    },

    {
        path: "*",
        page: NotFoundPage
    }
];