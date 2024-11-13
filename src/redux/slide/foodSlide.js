import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    search: '',
}

export const foodSlide = createSlice({
    name: 'food',
    initialState,
    reducers: {
        searchFood: (state, action) => {
            state.search = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { searchFood } = foodSlide.actions

export default foodSlide.reducer