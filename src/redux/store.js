import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlide'
import counterReducer from './slide/counterSlide'

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        user: userReducer
    },
})