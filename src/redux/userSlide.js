import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    HoTen: '',
    AnhDaiDien: '',
    Email: '',
    DienThoai: '',
    access_token: '',
    id: '',
    isAdmin: false,
    refreshToken: '',
    Diachi: '',
    ThanhPho: '',
    Phuong: '',
    Huyen: ''

}

export const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { HoTen = '', AnhDaiDien = '', Email = '', access_token = '', DienThoai = '', _id = '', isAdmin, refreshToken = '', Diachi = '', ThanhPho = '', Phuong = '', Huyen = '' } = action.payload
            state.HoTen = HoTen ? HoTen : state.HoTen;
            state.AnhDaiDien = AnhDaiDien ? AnhDaiDien : state.AnhDaiDien;
            state.Email = Email ? Email : state.Email;
            state.DienThoai = DienThoai ? DienThoai : state.DienThoai;
            state.id = _id ? _id : state.id
            state.access_token = access_token ? access_token : state.access_token;
            state.isAdmin = isAdmin ? isAdmin : state.isAdmin;
            state.refreshToken = refreshToken ? refreshToken : state.refreshToken;
            state.Diachi = Diachi ? Diachi : state.Diachi;
            state.ThanhPho = ThanhPho ? ThanhPho : state.ThanhPho;
            state.Phuong = Phuong ? Phuong : state.Phuong;
            state.Huyen = Huyen ? Huyen : state.Huyen;
        },
        resetUser: (state) => {
            state.HoTen = '';
            state.AnhDaiDien = '';
            state.Email = '';
            state.DienThoai = '';
            state.id = '';
            state.access_token = '';
            state.isAdmin = false;
            state.refreshToken = ''
            state.Diachi = ''
            state.ThanhPho = '';
            state.Phuong = '';
            state.Huyen = '';
        },
    },
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlide.actions

export default userSlide.reducer