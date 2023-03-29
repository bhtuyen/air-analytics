import { Divider, Grid } from "@mui/material";
import { useState } from "react";
import CreateDevicesForm from "../components/devices/CreateDevicesForm";
import TableDevices from "../components/devices/TableDevices";
import MainLayout from "../components/layout/main-layout";
import { gridSpacing } from "../constants/theme"

export default function ListDevice(props) {
    const [load, setLoad] = useState(false);

    const handChangeLoad = () => {
        setLoad(!load);
    }

    return (
        <MainLayout>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <CreateDevicesForm reload={handChangeLoad}/>
                </Grid>
                <Divider sx={{ width: '100%', mt: 2 }}/>
                <Grid item xs={12}> 
                    <TableDevices load={load}/>
                </Grid>
            </Grid>
        </MainLayout>
    )
}