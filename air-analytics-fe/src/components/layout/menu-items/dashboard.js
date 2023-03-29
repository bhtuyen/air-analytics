import { IconDashboard } from "@tabler/icons";
import { path } from "../../../constants/path";

const icons = { IconDashboard };

const dashboard = {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    children: [
        {
            id: '',
            title: 'Dashboard',
            type: 'item',
            url: path.DASHBOARD,
            icon: icons.IconDashboard,
            breadcrumbs: false
        }
    ]
};

export default dashboard;