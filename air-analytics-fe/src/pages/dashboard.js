import {
    Autocomplete,
    Box,
    Grid,
    InputAdornment,
    TextField,
    Typography,
    useMediaQuery,
} from '@mui/material';
import MainLayout from '../components/layout/main-layout';
import { gridSpacing } from '../constants/theme';
import { IconCloud, IconMapPin } from '@tabler/icons';
import LineCharts from '../components/dashboard/LineCharts';
import { useEffect, useMemo, useState } from 'react';
import { AIR_COLOR } from '../constants/air-color';
import { apiGetAllDevice } from '../services/Device';
import { apiGetLastMetric, apiGetMetrics } from '../services/Metric';
import { formatDate } from '../utils/format-date';
import { toast } from 'react-toastify';
import { theme } from '../themes';

const positions = [
    {
        id: 1,
        name: 'Trạm Đại Học Bách Khoa Hà Nội',
        vn_aqi: 50,
    },
    {
        id: 2,
        name: 'Trạm Đại Học Kinh Tế Quốc Dân',
        vn_aqi: 150,
    },
];

const getQuality = (vn_aqi) => {
    if (vn_aqi <= 50) return 'Tốt';
    if (vn_aqi <= 100) return 'Trung Bình';
    if (vn_aqi <= 150) return 'Kém';
    if (vn_aqi <= 200) return 'Xấu';
    if (vn_aqi <= 300) return 'Rất xấu';
    if (vn_aqi <= 500) return 'Nguy hại';
};
const getQualityColor = (vn_aqi) => {
    if (vn_aqi <= 50) return AIR_COLOR.good;
    if (vn_aqi <= 100) return AIR_COLOR.medium;
    if (vn_aqi <= 150) return AIR_COLOR.least;
    if (vn_aqi <= 200) return AIR_COLOR.bad;
    if (vn_aqi <= 300) return AIR_COLOR.veryBad;
    if (vn_aqi <= 500) return AIR_COLOR.dangoures;
};

const initMetric = {
    aqi: 40,
    metadata: {},
    device_id: 1,
    time: '',
};

function getWidth(isSm, length) {
    if (!isSm) {
        return length < 3 ? '20%' : length < 6 ? '40%' : '60%';
    } else {
        return length < 3 ? '40%' : length < 6 ? '80%' : '90%';
    }
}

const getMin = (arr) => {
    if (arr.length === 0) return 0;
    return Math.min(...arr);
};

const getMax = (arr) => {
    if (arr.length === 0) return 0;
    return Math.max(...arr);
};

export default function DashBoard(props) {
    const [devices, setDevices] = useState([]);
    const [device, setDevice] = useState(null);
    const [metric, setMetric] = useState(initMetric);
    const [metrics, setMetrics] = useState([]);
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchAPI = async () => {
            try {
                const response = await apiGetAllDevice();
                if (response) {
                    setDevices(response.data);
                    setDevice(response.data[0]);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchAPI();
    }, []);

    useEffect(() => {
        const fetchAPI = async () => {
            try {
                if (device !== null) {
                    const response = await apiGetLastMetric(device.id);
                    if (response.status === 200) {
                        if (response.data !== '') {
                            setMetric({
                                ...response.data,
                                time: formatDate(response.data.time),
                            });
                        } else setMetric(initMetric);
                    } else setMetric(initMetric);
                }
            } catch (err) {
                console.log(err);
            }
        };
        const interval = setInterval(async () => {
            await fetchAPI();
        }, 1000);
        return () => clearInterval(interval);
        // fetchAPI();
    }, [device]);

    useEffect(() => {
        const fetchAPI = async () => {
            try {
                if (device !== null) {
                    const response = await apiGetMetrics(device.id);
                    if (response.status === 200) {
                        setMetrics(
                            response.data?.map((p) => {
                                return {
                                    ...p,
                                    time: formatDate(p.time),
                                };
                            })
                        );
                    }
                }
            } catch (err) {
                console.log(err);
            }
        };
        const interval = setInterval(async () => {
            await fetchAPI();
        }, 1000);
        return () => clearInterval(interval);
        // fetchAPI();
    }, [device]);

    const dataCharts = useMemo(() => {
        return [
            {
                seriesName: 'VN_AQI',
                seriesData: metrics.map((p) => p.aqi),
                titleText: 'Biểu đồ giá trị VN_AQI',
                yaxisTitle: 'VN_AQI(µg/m3)',
                minYaxis: getMin(metrics.map((p) => p.aqi)),
                maxYaxis: getMax(metrics.map((p) => p.aqi)),
                xaxisCategories: metrics.map((p) => p.time),
            },
            {
                seriesName: 'NO2',
                seriesData: metrics.map((p) => p.metadata.NO2),
                titleText: 'Biểu đồ giá trị NO2',
                yaxisTitle: 'NO2(µg/m3)',
                minYaxis: getMin(metrics.map((p) => p.metadata.NO2)),
                maxYaxis: getMax(metrics.map((p) => p.metadata.NO2)),
                xaxisCategories: metrics.map((p) => p.time),
            },
            {
                seriesName: 'SO2',
                seriesData: metrics.map((p) => p.metadata.SO2),
                titleText: 'Biểu đồ giá trị SO2',
                yaxisTitle: 'SO2(µg/m3)',
                minYaxis: getMin(metrics.map((p) => p.metadata.SO2)),
                maxYaxis: getMax(metrics.map((p) => p.metadata.SO2)),
                xaxisCategories: metrics.map((p) => p.time),
            },
            {
                seriesName: 'CO',
                seriesData: metrics.map((p) => p.metadata.CO),
                titleText: 'Biểu đồ giá trị CO',
                yaxisTitle: 'CO(µg/m3)',
                minYaxis: getMin(metrics.map((p) => p.metadata.CO)),
                maxYaxis: getMax(metrics.map((p) => p.metadata.CO)),
                xaxisCategories: metrics.map((p) => p.time),
            },
            {
                seriesName: 'PM2.5',
                seriesData: metrics.map((p) => p.metadata['PM2.5']),
                titleText: 'Biểu đồ giá trị PM2.5',
                yaxisTitle: 'PM2.5(µg/m3)',
                minYaxis: getMin(metrics.map((p) => p.metadata['PM2.5'])),
                maxYaxis: getMax(metrics.map((p) => p.metadata['PM2.5'])),
                xaxisCategories: metrics.map((p) => p.time),
            },
            {
                seriesName: 'PM10',
                seriesData: metrics.map((p) => p.metadata.PM10),
                titleText: 'Biểu đồ giá trị PM10',
                yaxisTitle: 'PM10(µg/m3)',
                minYaxis: getMin(metrics.map((p) => p.metadata.PM10)),
                maxYaxis: getMax(metrics.map((p) => p.metadata.PM10)),
                xaxisCategories: metrics.map((p) => p.time),
            },
        ];
    }, [metrics]);

    const widthColumn = useMemo(() => {
        return getWidth(isSm, metrics.length);
    }, [metrics]);

    return (
        <MainLayout>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Autocomplete
                        options={devices}
                        getOptionLabel={(option) => option.position}
                        value={device}
                        disableClearable
                        isOptionEqualToValue={(option, value) =>
                            option?.id === value?.id
                        }
                        onChange={(event, newValue) => {
                            console.log(newValue);
                            setDevice(newValue);
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Position" />
                        )}
                    />
                </Grid>
                {metrics.length > 0 && (
                    <>
                        <Grid
                            item
                            xs={12}
                            md={12}
                            lg={6}
                            sx={{ display: 'flex' }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    backgroundColor: getQualityColor(
                                        metric.aqi
                                    ),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-around',
                                    borderRadius: '24px',
                                    // height: '200px',
                                    padding: '10px',
                                    color: '#fff',
                                }}
                            >
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignContent: 'space-between',
                                        justifyContent: 'center',
                                        height: '100%',
                                    }}
                                >
                                    <Typography
                                        variant={!isSm ? 'h2' : 'h4'}
                                        sx={{ color: '#fff', mb: 2 }}
                                    >
                                        {'VN_AQI'}
                                    </Typography>
                                    <Typography
                                        variant={!isSm ? 'h2' : 'h4'}
                                        sx={{ color: '#fff' }}
                                    >
                                        {metric.aqi}
                                    </Typography>
                                </Box>
                                <IconCloud size={!isSm ? 200 : 120} />
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'space-between',
                                    }}
                                >
                                    <Typography
                                        variant={!isSm ? 'h2' : 'h4'}
                                        sx={{ color: '#fff', mb: 2 }}
                                    >
                                        {'Chất lượng'}
                                    </Typography>
                                    <Typography
                                        variant={!isSm ? 'h2' : 'h4'}
                                        sx={{ color: '#fff' }}
                                    >
                                        {getQuality(metric.aqi)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={12}
                            lg={6}
                            sx={{ display: 'flex', flexDirection: 'column' }}
                        >
                            <Box
                                sx={{
                                    flex: 1,
                                    width: '100%',
                                    textAlign: 'center',
                                }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={6} md={3}>
                                        <Typography variant="h5">
                                            {'Nhiệt độ (°C)'}
                                        </Typography>
                                        <Typography variant="body1">
                                            {metric.metadata?.temperature}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Typography variant="h5">
                                            {'Độ ẩm (%)'}
                                        </Typography>
                                        <Typography variant="body1">
                                            {metric.metadata?.humidity}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Typography variant="h5">
                                            {'Ánh sáng (Lux)'}
                                        </Typography>
                                        <Typography variant="body1">
                                            {metric.metadata.light}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Typography variant="h5">
                                            {'NO2 (µg/m3)'}
                                        </Typography>
                                        <Typography variant="body1">
                                            {metric.metadata.NO2}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box
                                sx={{
                                    flex: 1,
                                    width: '100%',
                                    textAlign: 'center',
                                }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={6} md={3}>
                                        <Typography variant="h5">
                                            {'PM2.5 (µg/m3)'}
                                        </Typography>
                                        <Typography variant="body1">
                                            {metric.metadata['PM2.5']}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Typography variant="h5">
                                            {'PM10 (µg/m3)'}
                                        </Typography>
                                        <Typography variant="body1">
                                            {metric.metadata.PM10}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Typography variant="h5">
                                            {'CO (µg/m3)'}
                                        </Typography>
                                        <Typography variant="body1">
                                            {metric.metadata.CO}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Typography variant="h5">
                                            {'SO2 (µg/m3)'}
                                        </Typography>
                                        <Typography variant="body1">
                                            {metric.metadata.SO2}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box
                                sx={{
                                    flex: 1,
                                    width: '100%',
                                    textAlign: 'center',
                                }}
                            >
                                <Typography variant="h5">{`Cập nhật mới nhất lúc: ${metric?.time}`}</Typography>
                            </Box>
                        </Grid>
                        {dataCharts.map((p, index) => {
                            return (
                                <Grid item xs={12} md={6} key={index}>
                                    <LineCharts
                                        seriesName={p.seriesName}
                                        seriesData={p.seriesData}
                                        titleText={p.titleText}
                                        yaxisTitle={p.yaxisTitle}
                                        xaxisCategories={p.xaxisCategories}
                                        minYaxis={0}
                                        maxYaxis={p.maxYaxis}
                                        widthColumn={widthColumn}
                                    />
                                </Grid>
                            );
                        })}
                    </>
                )}
            </Grid>
        </MainLayout>
    );
}
