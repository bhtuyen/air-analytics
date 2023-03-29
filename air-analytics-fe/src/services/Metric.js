import { SERVICE_URL } from "../constants/config"
import api from './Api';

export const apiGetLastMetric = async(id) => {
    let url = SERVICE_URL + '/metrics/devices/' + id + '?limit=1';
    const response = await api.get(url);
    return response;
}

export const apiGetMetrics = async(id) => {
    let url = SERVICE_URL + '/metrics/devices/' + id;
    const response = await api.get(url);
    return response;
}