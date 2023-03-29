import { EnvironmentTwoTone } from '@ant-design/icons';
import { Switch } from 'antd';
import moment from 'moment';
import React, { useState, memo, useRef, useEffect } from 'react';
import mqtt from 'precompiled-mqtt';

const IP = '10.13.9.39';

function Device({ props, deviceIdSend, setDeviceIdSend }) {
    const { id, name, state: initState, position } = props;
    const [deviceState, setDeviceState] = useState(!!initState);
    const [isSend, setIsSend] = useState(false);

    const isSendData = useRef();
    const client = useRef(mqtt.connect(`mqtt://${IP}:9001`));

    useEffect(() => {
        if (isSend) {
            isSendData.current = setInterval(() => {
                client.current.publish(
                    'air/data',
                    JSON.stringify({
                        metadata: {
                            SO2: Math.floor(Math.random() * 21),
                            CO: Math.floor(Math.random() * 21),
                            'PM2.5': 10 + Math.floor(Math.random() * 141),
                            PM10: 20 + Math.floor(Math.random() * 61),
                            NO2: Math.floor(Math.random() * 61),
                            temperature: 15 + Math.floor(Math.random() * 11),
                            humidity: 52 + Math.floor(Math.random() * 20),
                            light: 105 + Math.floor(Math.random() * 10),
                        },
                        device_id: id,
                        time: moment().format('YYYY-MM-D HH:mm:ss'),
                    })
                );
            }, 5000);
        } else {
            clearInterval(isSendData.current);
        }
        return () => clearInterval(isSendData.current);
    }, [isSend, id]);

    useEffect(() => {
        setIsSend(deviceIdSend === id ? true : false);
    }, [deviceIdSend, id]);

    useEffect(() => {
        client.current.on('connect', () => {
            console.log(`Device ${id} connect to broker`);
        });
        client.current.subscribe('device/state');
    }, [id]);

    client.current.on('message', (topic, payload) => {
        if (topic === 'device/state') {
            const device = JSON.parse(payload.toString());
            if (device.id === id) {
                setDeviceState(device.state ? true : false);
                if (!device.state && deviceState) {
                    setIsSend(false);
                }
            }
        }
    });

    const onChangeStatus = (checked) => {
        // client.current.publish(
        //     'state',
        //     JSON.stringify({ device_id: id, state: checked ? 1 : 0 })
        // );
        clearInterval(isSendData.current);
        setDeviceState(checked);
    };

    const onChangeSend = (checked) => {
        setIsSend(checked);
        // if (!deviceState) {
        //     setDeviceState(checked);
        //     client.current.publish(
        //         'device/state',
        //         JSON.stringify({ device_id: id, state: 1 })
        //     );
        // }
        setDeviceIdSend(id);
        clearInterval(isSendData.current);
    };

    return (
        <div className="device-item">
            <div className="device-position">
                <EnvironmentTwoTone />
                <span>{position}</span>
            </div>
            <div className="device-name">
                <span>{name}</span>
            </div>

            <div className="device-button">
                <div className="btn">
                    <Switch
                        onChange={onChangeStatus}
                        defaultChecked={!!deviceState}
                        checked={deviceState}
                    />
                    <span>{!!deviceState ? 'On' : 'Off'}</span>
                </div>
                <div className="btn">
                    <Switch
                        onChange={onChangeSend}
                        defaultChecked={isSend}
                        checked={isSend}
                    />
                    <span>{isSend ? 'send' : 'stop'}</span>
                </div>
            </div>
        </div>
    );
}

export default memo(Device);
