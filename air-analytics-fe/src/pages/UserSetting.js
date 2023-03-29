import { Autocomplete, Button, Grid, Switch, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import MainLayout from "../components/layout/main-layout";
import { gridSpacing } from "../constants/theme";
import { openAlertModal } from "../redux/alertSlice";
import { closeLoadingModal, openLoadingModal } from "../redux/loadingSlice";
import { apiGetProfile, apiUpdateProfile } from "../services/Authentication";

export default function UserSetting(props) {
    const [user, setUser] = useState({
        alert_status: false
    });
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAPI = async() => {
            try {
                const response = await apiGetProfile();
                if (response.status === 200) setUser(response.data);
            } catch(err) {
                console.log(err);
            }
        }

        fetchAPI();
    }, [])

    console.log(user);

    const handleChangeUser = (property, value) => {
        setUser({ ...user, [property]: value });
    }

    const handleUpdateProfile = async() => {
        let dataAlert = {
            isOpen: false,
            severity: 'success',
            message: '',
        }
        try {
            dispatch(openLoadingModal());
            const response = await apiUpdateProfile(user);
            dispatch(closeLoadingModal())
            if (response.status === 200) {
                dataAlert = { ...dataAlert, isOpen: true, message: "Cập nhật cài đặt thành công"}
                dispatch(openAlertModal(dataAlert));
            }
        } catch(err) {
            dispatch(closeLoadingModal())
            console.log(err);
        }
    }
    return (
        <MainLayout>
            <Grid container spacing={gridSpacing} justifyContent="center" alignItems={'center'}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography variant="h5" color="primary">
                        Cài đặt ngưỡng cảnh bảo để bảo vệ tốt chất lượng không khí
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5">Cài đặt thông báo</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h5">Cài đặt thông báo khi chất lượng không khí xấu đi</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Switch
                        checked={user?.alert_status}
                        onChange={(event) => handleChangeUser('alert_status', event.target.checked)}
                    />
                </Grid>
                {(user !== null && user?.alert_status)&&
                    <>
                        <Grid item xs={6}>
                            <Typography variant="body1">
                                Cài đặt ngưỡng cảnh báo
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label={"Ngưỡng cảnh bảo"}
                                // type="number"
                                value={user?.min_aqi}
                                onChange={(event) => handleChangeUser('min_aqi', event.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">
                                {'Thời gian cảnh báo (phút)'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label={"Thời gian cảnh báo"}
                                // type="number"
                                value={user?.time}
                                onChange={(event) => handleChangeUser('time', event.target.value)}
                                fullWidth
                            />
                        </Grid>
                    </>
                }
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" color="secondary" onClick={handleUpdateProfile}>
                        Cập nhật
                    </Button>
                </Grid>
            </Grid>
        </MainLayout>
    )
}