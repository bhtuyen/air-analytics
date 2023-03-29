import { ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import { toast } from "react-toastify";
import UserRoutes from "./routes/routes";
import { apiGetProfile } from "./services/Authentication";
import { apiGetAllDevice } from "./services/Device";
import { apiGetLastMetric } from "./services/Metric";
import { theme } from "./themes";


function App() {
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const responseSettings = await apiGetProfile();
        const setting = responseSettings.data;
        const responseDevices = await apiGetAllDevice();
        const allDevices = responseDevices.data;
        Promise.all(allDevices.map(async (device) => {
          const responseMetric = await apiGetLastMetric(device.id);
          const lastMetric = responseMetric.data;
          if (lastMetric !== '') {
            if (lastMetric.aqi >= setting.min_aqi && setting.alert_status === true)
              toast(`Chỉ số AQI trạm ${device.position} đã vượt ngưỡng cảnh báo`, {
                position: "bottom-right",
                autoClose: setting.time * 60 * 1000,
                type: 'error'
              });
          }
        }))
      } catch (err) {
        console.log(err);
      }
    }
    fetchAPI();
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <UserRoutes />
    </ThemeProvider>
  );
}

export default App;
