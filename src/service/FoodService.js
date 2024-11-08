import axios from "axios"

export const getAllFood = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/food/get-all`)
    return res.data
}

export const createFood = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/food/create`, data)
    return res.data
}


