import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Componentes de Material ui
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

// Iconos de material ui
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// componentes customizados
import Alert from '../../customComponents/Alert.jsx';

// estilos
import "./PageStyle.css";

// utilidades
import Regex from "../../utils/regex.js";
import { loginAction } from '../../actions/pageActions.js';

// Contexto para funciones globales
import { setSesionActive, setUserActive, useAppController } from '../../context/index.js';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [alertContent, setAlertContent] = useState({});

    const navigate = useNavigate();

    const [controller, dispatch] = useAppController();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const validate = () => {
        if (!user.trim()) {
            return {
                msg: "El usuario es obligatorio",
                pass: false
            };
        }
        if (!password.trim()) {
            return {
                msg: "La contraseña es obligatorio",
                pass: false
            };
        }
        if (!Regex.email.test(user)) {
            return {
                msg: "El usuario no es valido",
                pass: false
            };
        }
        return { pass: true };
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        const { pass, msg } = validate();
        if (!pass) {
            setAlertContent({
                open: true,
                type: 'error',
                message: msg
            });
            return;
        }
        const data = {
            correo_electronico: user,
            contrasena: password,
        }
        try {
            const { status, msg: message, data: dataRes } = await loginAction(data);
            if (status === "success") {
                logginIn(dataRes);
            }
            setAlertContent({
                open: true,
                type: status,
                message
            });
        } catch (error) {
            console.log(error);
            setAlertContent({
                open: true,
                type: "error",
                message: "Usuario y/o contraseña incorrectos"
            });
        }
    }

    const logginIn = ({ jwt, data }) => {
        setUserActive(dispatch, data);
        setSesionActive(dispatch, true);
        localStorage.setItem('token', jwt)
    }

    const sendToRegister = () => navigate('/register');

    const setOpen = (value) => setAlertContent((prev) => ({ ...prev, open: false }));

    return (
        <Grid container mt={10} direction="row" alignItems="center" justifyContent="center" justify="center">
            <Grid item xs={12} md={6}>
                <Card className="Card">
                    <CardContent className='CardContent'>
                        <Grid container direction="column" alignItems="center" justifyContent="center" justify="center">
                            <Grid item xs={12}>
                                <Typography variant="h3" align="center">Inicio de sesión</Typography>
                            </Grid>
                            <Grid item xs={8} mt={2}>
                                <Box>
                                    <FormControl variant="standard" sx={{ m: 1, width: '50ch' }}>
                                        <InputLabel htmlFor="email">Usuario</InputLabel>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={user}
                                            onChange={(e) => setUser(e.target.value)} />
                                    </FormControl>
                                </Box>
                                <Box>
                                    <FormControl variant="standard" sx={{ m: 1, width: '50ch' }}>
                                        <InputLabel htmlFor="standard-adornment-password">Contraseña</InputLabel>
                                        <Input
                                            id="standard-adornment-password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                </Box>
                                <Box align="center" mt={2}>
                                    <Button variant="contained" onClick={onSubmit}>
                                        Ingresar
                                    </Button>
                                </Box>
                                <Box align="center" mt={2}>
                                    <Typography sx={{ cursor: 'pointer' }} onClick={sendToRegister}>¿No tienes una cuenta?</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Alert {...alertContent} setOpen={setOpen} />
            </Grid>
        </Grid>
    )
}

export default Login;