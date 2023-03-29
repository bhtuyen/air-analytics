import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography,
    useMediaQuery
} from '@mui/material';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { apiLogin } from '../../services/Authentication';
import LocalStorage from '../../services/LocalStorage';
import { useNavigate } from 'react-router-dom';
import { openAlertModal } from '../../redux/alertSlice';
import { useDispatch } from 'react-redux';

const LoginForm = ({ ...others }) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [user, setUser] = useState({
        username: '',
        password: ''
    })
    const [checked, setChecked] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleLogin = async() => {
        try {
            const response = await apiLogin(user);
            console.log(response);
            if (!response.data.err) {
                LocalStorage.updateLocalAccessToken(response.data.token);
                navigate('/');
                navigate(0);
            }
            else {
                dispatch(openAlertModal({ severity: 'error', isOpen: true, message: response.data.err }));
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <form noValidate {...others}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-email-login"
                        value={user.username}
                        name="email"
                        onChange={(event) => setUser({ ...user, username: event.target.value })}
                        label="Email Address / Username"
                        inputProps={{}}
                    />
                </FormControl>

                <FormControl
                    fullWidth
                    sx={{ ...theme.typography.customInput }}
                >
                    <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password-login"
                        type={showPassword ? 'text' : 'password'}
                        value={user.password}
                        name="password"
                        onChange={(event) => setUser({...user, password: event.target.value })}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    size="large"
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                        inputProps={{}}
                    />
                </FormControl>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={checked}
                                onChange={(event) => setChecked(event.target.checked)}
                                name="checked"
                                color="primary"
                            />
                        }
                        label="Remember me"
                    />
                    <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                        Forgot Password?
                    </Typography>
                </Stack>
                <Box sx={{ mt: 2 }}>
                    <Button
                        disableElevation
                        onClick={handleLogin}
                        fullWidth
                        size="large"
                        variant="contained"
                        color="secondary"
                    >
                        Sign in
                    </Button>
                </Box>
            </form>
        </>
    );
};

export default LoginForm;
