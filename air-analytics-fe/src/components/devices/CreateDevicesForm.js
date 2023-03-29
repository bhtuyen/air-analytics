import { Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { gridSpacing } from "../../constants/theme";
import { openAlertModal } from "../../redux/alertSlice";
import { closeLoadingModal, openLoadingModal } from "../../redux/loadingSlice";
import { apiCreateDevice } from "../../services/Device";

const INIT_DEVICE = {
    name: '',
    position: ''
}


export default function CreateDevicesForm(props) {
    const [device, setDevice] = useState(INIT_DEVICE);
    const dispatch = useDispatch();

    const handleChangeDevice = (property) => (event) => {
        setDevice({...device, [property]: event.target.value});
    }

    const handleCreateDevie = async() => {
        let dataAlert = {
            isOpen: false,
            severity: 'success',
            message: ''
        }
        try {
            dispatch(openLoadingModal());
            const response = await apiCreateDevice(device);
            dispatch(closeLoadingModal());
            if (response) {
                dataAlert = { ...dataAlert, isOpen: true, messgae: 'Thêm mới thiết bị thành công' }
                dispatch(openAlertModal(dataAlert));
                props.reload();
            }
        } catch(err) {
            dispatch(closeLoadingModal());
            dataAlert = { ...dataAlert, isOpen: true, messgae: 'Thêm mới thiết bị thất bại', type: 'error' }
            dispatch(openAlertModal(dataAlert));
            console.log(err);
        }
    }

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Typography variant="h5" color={'primary'}>Create New Device</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField 
                    label="Name"
                    value={device.name}
                    onChange={handleChangeDevice('name')}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    label="Position"
                    value={device.position}
                    onChange={handleChangeDevice('position')}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" onClick={handleCreateDevie}>Create Device</Button>
            </Grid>
        </Grid>
    )
}