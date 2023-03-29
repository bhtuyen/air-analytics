import { SERVICE_URL } from '../constants/config'
import api from './Api'

export const apiRegister = async(user) => {
    let url = SERVICE_URL + '/auth/register';
    const response = await api.post(url, user);
    return response;
}

export const apiLogin = async(user) => {
    let url = SERVICE_URL + '/auth/login';
    const response = await api.post(url, user);
    return response;
}

export const apiLogout = async() => {
    let url = SERVICE_URL + '/auth/logout';
    const response = await api.get(url);
    return response;
}

export const apiGetProfile = async() => {
    let url = SERVICE_URL + '/auth/profiles';
    const response = await api.get(url);
    return response;
}

export const apiUpdateProfile = async(user) => {
    let url = SERVICE_URL + '/auth/profiles';
    const response = await api.put(url, user);
    return response;

}