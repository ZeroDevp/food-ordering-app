import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlide'
import foodReducer from './slide/foodSlide'

export const store = configureStore({
    reducer: {
        food: foodReducer,
        user: userReducer
    },
})