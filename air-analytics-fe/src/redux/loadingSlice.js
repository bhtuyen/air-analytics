import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: {
        isOpen: false
    }
}

export const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        openLoadingModal: (state) => {
            state.data.isOpen = true;
        },
        closeLoadingModal: (state) => {
            state.data.isOpen = false;
        }
    }
})

export const { openLoadingModal, closeLoadingModal } = loadingSlice.actions;

export default loadingSlice.reducer;