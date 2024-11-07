import axios from "axios"

export const getAllFood = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/food/get-all`)
    return res.data
}