import { Alert, Fade, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeAlertModal } from "../../redux/alertSlice";

export default function AlertModal() {
    const data = useSelector(state => state.alert.data); 
    console.log(data);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setOpen(data.isOpen);
    }, [data.isOpen]) 

    const handleClose = () => {
        console.log("close");
        dispatch(closeAlertModal());
    }
    return (
        <Snackbar 
            open={open} 
            autoHideDuration={6000} 
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            TransitionComponent={Fade}>
            <Alert onClose={handleClose} severity={data.severity} sx={{ width: '100%' }}>
                {data.message}
            </Alert>
        </Snackbar>
    )
}