// import { createSlice } from '@reduxjs/toolkit'

// const initialState = {
//     HoTen: "",
//     Email: "",
//     MatKhau: '',
//     access_token: ""
// }

// export const userSlide = createSlice({
//     name: 'user',
//     initialState,
//     reducers: {
//         updateUser: (state, action) => {
//             const { HoTen, Email, MatKhau, access_token } = action.payload
//             state.HoTen = HoTen;
//             state.Email = Email;
//             state.MatKhau = MatKhau;
//             state.access_token = access_token;
//         },
//     },
// })

// // Action creators are generated for each case reducer function
// export const { updateUser } = userSlide.actions

// export default userSlide.reducer

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    HoTen: '',
    Email: '',
    DienThoai: '',
    access_token: '',
    id: '',
    isAdmin: false,
    refreshToken: '',
    DiaChi: '',
    ThanhPho: '',
    Phuong: '',
    Huyen: ''

}

export const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { HoTen = '', Email = '', access_token = '', DienThoai = '', _id = '', isAdmin, refreshToken = '', DiaChi = '', ThanhPho = '', Phuong = '', Huyen = '' } = action.payload
            state.HoTen = HoTen ? HoTen : state.HoTen;
            state.Email = Email ? Email : state.Email;
            state.DienThoai = DienThoai ? DienThoai : state.DienThoai;
            state.id = _id ? _id : state.id
            state.access_token = access_token ? access_token : state.access_token;
            state.isAdmin = isAdmin ? isAdmin : state.isAdmin;
            state.refreshToken = refreshToken ? refreshToken : state.refreshToken;
            state.DiaChi = DiaChi ? DiaChi : state.DiaChi;
            state.ThanhPho = ThanhPho ? ThanhPho : state.ThanhPho;
            state.Phuong = Phuong ? Phuong : state.Phuong;
            state.Huyen = Huyen ? Huyen : state.Huyen;
        },
        resetUser: (state) => {
            state.HoTen = '';
            state.Email = '';
            state.DienThoai = '';
            state.id = '';
            state.access_token = '';
            state.isAdmin = false;
            state.refreshToken = ''
            state.DiaChi = ''
            state.ThanhPho = '';
            state.Phuong = '';
            state.Huyen = '';
        },
    },
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlide.actions

export default userSlide.reducer