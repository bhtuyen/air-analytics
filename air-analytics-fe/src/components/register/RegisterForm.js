import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { strengthIndicator, strengthColor } from '../../utils/password-strength';
import { apiRegister } from '../../services/Authentication';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const RegisterForm = ({ ...others }) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [showPassword, setShowPassword] = useState(false);
    const [checked, setChecked] = useState(true);
    const [user, setUser] = useState({
        name: '',
        username: '',
        password: '',
    });
    const navigate = useNavigate();
    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();


    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    const handleSignup = async() => {
        try {
            const response = await apiRegister(user);
            console.log(response);
            if (!response?.err) navigate('/login');
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        changePassword('');
    }, []);

    return (
        <>
            <form noValidate {...others}>
                <Grid container spacing={matchDownSM ? 0 : 2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            margin="normal"
                            name="fname"
                            type="text"
                            value={user.name}
                            onChange={(event) => setUser({ ...user, name: event.target.value })}
                            sx={{ ...theme.typography.customInput }}
                        />
                    </Grid>
                </Grid>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="outlined-adornment-email-register">Email Address / Username</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-email-register"
                        type="email"
                        value={user.username}
                        name="email"
                        onChange={(event) => setUser({ ...user, username: event.target.value })}
                        inputProps={{}}
                    />
                </FormControl>
                <FormControl
                    fullWidth
                    sx={{ ...theme.typography.customInput }}
                >
                    <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password-register"
                        type={showPassword ? 'text' : 'password'}
                        value={user.password}
                        name="password"
                        label="Password"
                        onChange={(e) => {
                            setUser({...user, password: e.target.value });
                            changePassword(e.target.value);
                        }}
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
                        inputProps={{}}
                    />
                </FormControl>

                <FormControl fullWidth>
                    <Box sx={{ mb: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Box
                                    style={{ backgroundColor: level?.color }}
                                    sx={{ width: 85, height: 8, borderRadius: '7px' }}
                                />
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle1" fontSize="0.75rem">
                                    {level?.label}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </FormControl>

                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checked}
                                    onChange={(event) => setChecked(event.target.checked)}
                                    name="checked"
                                    color="primary"
                                />
                            }
                            label={
                                <Typography variant="subtitle1">
                                    Agree with &nbsp;
                                    <Typography variant="subtitle1" component={Link} to="#">
                                        Terms & Condition.
                                    </Typography>
                                </Typography>
                            }
                        />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button
                        disableElevation
                        onClick={handleSignup}
                        fullWidth
                        size="large"
                        variant="contained"
                        color="secondary"
                    >
                        Sign up
                    </Button>
                </Box>
            </form>
        </>
    );
};

export default RegisterForm;
