import { IconDevices2 } from "@tabler/icons";
import { path } from "../../../constants/path";

const icons = { IconDevices2 };

const device = {
    id: 'devices',
    title: 'Device',
    type: 'group',
    children: [
        {
            id: 'devices',
            title: 'List Device',
            type: 'item',
            url: path.DEVICES,
            icon: icons.IconDevices2,
            target: true,
        },
    ]
}

export default device;
