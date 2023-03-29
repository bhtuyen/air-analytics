import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Device from './components/Device';
import Login from './components/Login';

function App() {
    const [devices, setDevices] = useState([]);
    const [isLogin, setIsLogin] = useState(false);
    const [deviceIdSend, setDeviceIdSend] = useState(null);

    useEffect(() => {
        const getDevices = async () => {
            try {
                const res = await axios.get(
                    'http://localhost:3000/api/devices',
                    {
                        headers: {
                            Authorization: `Bearer ${JSON.parse(
                                localStorage.getItem('token')
                            )}`,
                        },
                    }
                );
                setDevices(res.data);
                return res;
            } catch (error) {
                console.log(error);
            }
        };
        if (isLogin) {
            getDevices();
        }
    }, [isLogin]);

    return (
        <div className="App">
            <div
                style={{
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6eb0ca',
                    fontWeight: '600',
                }}
            >
                {isLogin ? 'Login Success!' : <Login setIsLogin={setIsLogin} />}
            </div>
            <hr width="100%" color="#6eb0ca" align="right" size="5px" />

            {isLogin ? (
                <div className="device-manager">
                    {devices.map((device) => (
                        <Device
                            props={device}
                            deviceIdSend={deviceIdSend}
                            setDeviceIdSend={setDeviceIdSend}
                            key={device.id}
                        />
                    ))}
                </div>
            ) : (
                ''
            )}
        </div>
    );
}

export default App;
