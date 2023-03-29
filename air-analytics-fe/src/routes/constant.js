import { path } from '../constants/path';
import DashBoard from '../pages/dashboard';
import ListDevice from '../pages/ListDevice';
import Login from '../pages/login';
import Register from '../pages/register';
import UserSetting from '../pages/UserSetting';

export const ROUTES = [
    {
        path: path.DASHBOARD,
        element: DashBoard,
    },
    {
        path: path.LOGIN,
        element: Login,
    },
    {
        path: path.REGISTER,
        element: Register,
    },
    {
        path: path.DEVICES,
        element: ListDevice,
    },
    {
        path: path.USER_SETTING,
        element: UserSetting,
    },
];
