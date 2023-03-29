import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Modal, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { openAlertModal } from "../../redux/alertSlice";
import { closeLoadingModal, openLoadingModal } from "../../redux/loadingSlice";
import { apiUpdateDevice } from "../../services/Device";

const INIT_DEVICE = {
    name: '',
    position: ''
}

export default function EditDeviceModal(props) {
    const { open, data } = props;
    const [device, setDevice] = useState(INIT_DEVICE);
    const dispatch = useDispatch();

    useEffect(() => {
        setDevice(data);
    }, [data])

    const handleUpdateDevice = async() => {
        let dataAlert = {
            isOpen: false,
            severity: 'success',
            message: ''
        }
        try {
            dispatch(openLoadingModal());
            const response = await apiUpdateDevice(device.id, device);
            dispatch(closeLoadingModal());
            if (response) {
                dataAlert = { ...dataAlert, isOpen: true, message: "Cập nhật thiết bị thành công" }
                dispatch(openAlertModal(dataAlert));
                props.onUpdate();
                props.onClose();
                
            }
        } catch(err) {
            dispatch(closeLoadingModal());
            dataAlert = { ...dataAlert, isOpen: true, message: "Cập nhật thiết bị không thành công" }
            console.log(err);
        }
    }

    const handleChangeDevice = (property) => (event) => {
        setDevice({...device, [property]: event.target.value});
    }

    const handleClose = () => {
        props.onClose();
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md">
            <DialogTitle>Cập nhật thông tin thiết bị</DialogTitle>
            <DialogContent sx={{ paddingTop: '20px' }}>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={6}>
                        <TextField
                            label="Name"
                            value={device.name}
                            onChange={handleChangeDevice('name')}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Position"
                            value={device.position}
                            onChange={handleChangeDevice('position')}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleUpdateDevice}>Cập nhật</Button>
                <Button variant="contained" color="error" onClick={handleClose}>Hủy</Button>
            </DialogActions>
        </Dialog>
    )
}