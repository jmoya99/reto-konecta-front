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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


// Iconos de material ui
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// componentes customizados
import Alert from '../../customComponents/Alert.jsx';

// estilos
import "./PageStyle.css";

// utilidades
import Regex from "../../utils/regex.js";
import { registerAction } from '../../actions/pageActions.js';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [type, setType] = useState('');
    const [alertContent, setAlertContent] = useState({});

    const navigate = useNavigate();


    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const clearFields = () => {
        setUser('');
        setPassword('');
        setName('');
        setPhone('');
        setType('');
    }

    const validate = () => {
        if (!name.trim()) {
            return {
                msg: "El nombre es obligatorio",
                pass: false
            };
        }
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
        if (!phone.trim()) {
            return {
                msg: "El celular es obligatorio",
                pass: false
            };
        }
        if (!type) {
            return {
                msg: "El tipo de usuario es obligatorio",
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
            nombre: name,
            correo_electronico: user,
            contrasena: password,
            numero_movil: phone,
            tipo_usuario: type,
        };
        try {
            const { status, msg: message} = await registerAction(data);
            setAlertContent({
                open: true,
                type: status,
                message
            });
            if(status === "success"){
                clearFields();
            }
        } catch (error) {
            setAlertContent({
                open: true,
                type: "error",
                message: "El correo ya está registrado"
            });
        }
    }

    const setOpen = (value) => setAlertContent((prev) => ({ ...prev, open: false }));

    const sendToLogin = () => navigate('/');

    return (
        <Grid container mt={10} direction="row" alignItems="center" justifyContent="center" justify="center">
            <Grid item xs={12} md={6}>
                <Card className="Card">
                    <CardContent className='CardContent'>
                        <Grid container direction="column" alignItems="center" justifyContent="center" justify="center">
                            <Grid item xs={12}>
                                <Typography variant="h3" align="center">Registro</Typography>
                            </Grid>
                            <Grid item xs={8} mt={2}>
                                <Box>
                                    <FormControl variant="standard" sx={{ m: 1, width: '50ch' }}>
                                        <InputLabel htmlFor="nombre">Nombre</InputLabel>
                                        <Input
                                            id="nombre"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)} />
                                    </FormControl>
                                </Box>
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
                                <Box>
                                    <FormControl variant="standard" sx={{ m: 1, width: '50ch' }}>
                                        <InputLabel htmlFor="phone">Celular</InputLabel>
                                        <Input
                                            id="phone"
                                            type="phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)} />
                                    </FormControl>
                                </Box>
                                <Box>
                                    <FormControl variant="standard" sx={{ m: 1, width: '50ch' }}>
                                        <InputLabel id="type">Tipo de usuario</InputLabel>
                                        <Select
                                            labelId="typelabel"
                                            id="typeSelect"
                                            value={type}
                                            label="Age"
                                            onChange={(e) => setType(e.target.value)}
                                        >
                                            <MenuItem value="Administrador">Administrador</MenuItem>
                                            <MenuItem value="Usuario">Usuario</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box align="center" mt={2}>
                                    <Button variant="contained" onClick={onSubmit}>
                                        Registrar
                                    </Button>
                                </Box>
                                <Box align="center" mt={2}>
                                <Typography sx={{ cursor: 'pointer' }} onClick={sendToLogin}>¿Ya tienes una cuenta?</Typography>
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

export default Register;