import axios from "axios"
import { axiosJWT } from "./UserService";

export const getAllFood = async (search, limit, sort, priceFilter) => {
    let res = {};
    const baseUrl = `${process.env.REACT_APP_API_URL}/food/get-all`;

    let query = `?limit=${limit}`;

    if (search?.length > 0) {
        query += `&filter=name=${search}`;
    }

    if (priceFilter) {
        query += `&filter=price=${priceFilter}`;
    }

    if (sort) {
        query += `&sort=${sort}`;
    }

    res = await axios.get(`${baseUrl}${query}`);
    return res.data;
};

export const createFood = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/food/create`, data)
    return res.data
}

export const getDetailsFood = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/food/get-details/${id}`)
    return res.data
}

export const updateFood = async (id, access_token, data) => {
    const res = await axiosJWT.put(
        `${process.env.REACT_APP_API_URL}/food/update/${id}`,
        data,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        }
    );
    return res.data;
};

export const deleteFood = async (id, access_token) => {
    const res = await axiosJWT.delete(
        `${process.env.REACT_APP_API_URL}/food/delete/${id}`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        }
    );
    return res.data;
};


