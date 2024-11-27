// import axios from "axios"
import { axiosJWT } from "./UserService";



export const createOrder = async (data, access_token) => {
    const res = await axiosJWT.post(
        `${process.env.REACT_APP_API_URL}/order/create`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    }
    );
    return res.data;
};

export const getOrderbyUserId = async (id, access_token) => {
    const res = await axiosJWT.get(
        `${process.env.REACT_APP_API_URL}/order/get-all-order/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
};

export const getDetailsOrder = async (id, access_token) => {
    const res = await axiosJWT.get(
        `${process.env.REACT_APP_API_URL}/order/get-details-order/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
};

export const cancelOrder = async (id, access_token, DonHang) => {
    const res = await axiosJWT.delete(
        `${process.env.REACT_APP_API_URL}/order/cancel-order/${id}`, { data: DonHang },
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        }
    );
    return res.data;
};

export const getAllOrder = async (access_token) => {
    const res = await axiosJWT.get(
        `${process.env.REACT_APP_API_URL}/order/getAllOrder`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        }
    );
    return res.data;
};


export const updateOrderStatus = async ({ orderId, status }, access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/update-status`, { orderId, status }, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    return res.data;
};


export const markOrderAsReceived = async ({ orderId, DaThanhToan, DaGiao }, access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/mark-as-received`, { orderId, DaThanhToan, DaGiao }, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    return res.data;
};

export const getRevenueByMonth = async (month, year, access_token) => {
    const res = await axiosJWT.get(
        `${process.env.REACT_APP_API_URL}/order/revenue-by-month`,
        {
            params: { month, year },
            headers: { Authorization: `Bearer ${access_token}` },
        }
    );
    return res.data;
};

export const getAvailableYears = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/available-years`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    return res.data;
};

export const getAvailableMonths = async (year, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/available-months`, {
        params: { year },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    return res.data;
};

export const getAnnualRevenue = async (year, access_token) => {
    const res = await axiosJWT.get(
        `${process.env.REACT_APP_API_URL}/order/annual-revenue`,
        {
            params: { year },
            headers: { Authorization: `Bearer ${access_token}` },
        }
    );
    return res.data;
};