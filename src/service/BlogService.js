import axios from "axios"
import { axiosJWT } from "./UserService";

export const getAllBlog = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/blog/get-all`)
    return res.data
}

export const createBlog = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/blog/create`, data)
    return res.data
}

export const updateBlog = async (id, access_token, data) => {
    const res = await axiosJWT.put(
        `${process.env.REACT_APP_API_URL}/blog/update/${id}`,
        data,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        }
    );
    return res.data;
};


export const deleteBlog = async (id, access_token) => {
    const res = await axiosJWT.delete(
        `${process.env.REACT_APP_API_URL}/blog/delete/${id}`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        }
    );
    return res.data;
};

export const getDetailsBlog = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/blog/get-details/${id}`)
    return res.data
}