import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import axios from 'axios';

const Login = ({ setIsLogin }) => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const res = await axios.post(
                'http://localhost:3000/api/auth/login',
                values
            );

            localStorage.setItem('token', JSON.stringify(res.data.token));
            setIsLogin(true);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Form
            form={form}
            name="horizontal_login"
            layout="inline"
            style={{
                display: 'flex',
                alignItems: 'center',
                position: 'absolute',
                right: '10px',
            }}
            onFinish={onFinish}
        >
            <Form.Item name="username">
                <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Username"
                />
            </Form.Item>
            <Form.Item name="password">
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item shouldUpdate>
                {() => (
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#6eb0ca',
                        }}
                    >
                        Log in
                    </Button>
                )}
            </Form.Item>
        </Form>
    );
};
export default Login;
