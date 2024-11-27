import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    DonHang: [],
    orderItemSelected: [],
    DiaChiGiaoHang: {
    },
    PhuongThucThanhToan: '',
    GiaDonHang: 0,
    GiaVanChuyen: 0,
    TongTien: 0,
    NguoiDung: '',
    DaThanhToan: false,
    NgayThanhToan: '',
    DaGiao: false,
    NgayGiao: '',
    TrangThaiGiaoHang: false,
    GiamGia: '',

}

export const orderSlide = createSlice({
    name: 'DonHang',
    initialState,
    reducers: {
        addOrderFood: (state, action) => {
            const { DonHangs } = action.payload
            const itemOrder = state?.DonHang?.find((item) => item?.food === DonHangs.food)
            if (itemOrder) {
                itemOrder.SoLuong += DonHangs?.SoLuong
            } else {
                state.DonHang.push(DonHangs)
            }
        },
        increaseSoLuong: (state, action) => {
            const { idFood } = action.payload
            const itemOrder = state?.DonHang?.find((item) => item?.food === idFood)
            const itemOrderSeleted = state?.orderItemSelected?.find(item => item.food === idFood)
            itemOrder.SoLuong++;
            if (itemOrderSeleted) {
                itemOrderSeleted.SoLuong++;
            }
        },
        decreaseSoLuong: (state, action) => {
            const { idFood } = action.payload
            const itemOrder = state?.DonHang?.find((item) => item?.food === idFood)
            const itemOrderSeleted = state?.orderItemSelected?.find(item => item.food === idFood)
            itemOrder.SoLuong--;
            if (itemOrderSeleted) {
                itemOrderSeleted.SoLuong--;
            }
        },
        removeOrderFood: (state, action) => {
            const { idFood } = action.payload
            const itemOrder = state?.DonHang?.filter((item) => item?.food !== idFood)
            const itemOrderSeleted = state?.orderItemSelected?.filter((item) => item?.food !== idFood)
            state.DonHang = itemOrder
            state.orderItemSelected = itemOrderSeleted
        },

        removeAllOrderFood: (state, action) => {
            const { listChecked } = action.payload
            const itemOrder = state?.DonHang?.filter((item) => !listChecked.includes(item.food))
            const itemOrderSeleted = state?.DonHang?.filter((item) => !listChecked.includes(item.food))
            state.DonHang = itemOrder
            state.orderItemSelected = itemOrderSeleted
        },

        selectedOrder: (state, action) => {
            const { listChecked } = action.payload
            const orderSelected = []
            state.DonHang.forEach((order) => {
                if (listChecked.includes(order.food)) {
                    orderSelected.push(order)
                }
            })
            state.orderItemSelected = orderSelected
        },

        clearCart: (state) => {
            state.DonHang = []; // Reset the cart to an empty state
            state.orderItemSelected = []; // Optionally clear selected orders
        },
    },
})

// Action creators are generated for each case reducer function
export const { addOrderFood, increaseSoLuong, decreaseSoLuong, removeOrderFood, removeAllOrderFood, selectedOrder, clearCart } = orderSlide.actions

export default orderSlide.reducer