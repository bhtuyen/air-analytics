import { CircularProgress, Modal } from "@mui/material";
import { useSelector } from "react-redux";

export default function LoadingModal() {
    const data = useSelector(state => state.loading.data);
    return (
        <Modal open={data.isOpen} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
        </Modal>
    )
}