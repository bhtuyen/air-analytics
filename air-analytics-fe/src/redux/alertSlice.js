import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: {
        isOpen: false,
        severity: 'success',
        message: '',
    }
}

export const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        openAlertModal: (state, action) => {
            state.data = action.payload;
        },
        closeAlertModal: (state) => {
            state.data.isOpen = false;
        }
    }
})

export const { openAlertModal, closeAlertModal } = alertSlice.actions;

export default alertSlice.reducer;
