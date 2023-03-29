import { SERVICE_URL } from "../constants/config";
import api from './Api';

export const apiCreateDevice = async (device) => {
    let url = SERVICE_URL + '/devices/';
    const response = await api.post(url, device);
    return response;
}

export const apiGetAllDevice = async () => {
    let url = SERVICE_URL + '/devices';
    const response = await api.get(url);
    return response;
}

export const apiGetOneDevice = async (id) => {
    let url = SERVICE_URL + '/devices/' + id;
    const response = await api.get(url);
    return response;
}

export const apiUpdateDevice = async (id, data) => {
    let url = SERVICE_URL + '/devices/' + id;
    const response = await api.put(url, data);
    return response;
}