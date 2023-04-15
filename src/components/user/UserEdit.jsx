import _ from 'lodash';

import React, { useEffect, useState } from 'react';

// Material ui components
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
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
import Link from '@mui/material/Link';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// utilidades
import Regex from "../../utils/regex.js";
import callWS from '../../utils/callWS.js';

// componentes customizados
import Alert from '../../customComponents/Alert.jsx';


const UserEdit = ({ open, userInfo, handleClose }) => {
    const [user, setUser] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [type, setType] = useState('');
    const [alertContent, setAlertContent] = useState({});

    useEffect(() => {
        if (!_.isEmpty(userInfo)) {
            setUser(userInfo.correo_electronico);
            setName(userInfo.nombre);
            setPhone(userInfo.numero_movil);
            setType(userInfo.tipo_usuario);
        }
    }, [userInfo]);

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
    };

    const update = async(event) => {
        event.preventDefault();
        const { msg, pass } = validate();
        if (!pass) {
            setAlertContent({
                open: true,
                type: 'error',
                message: msg
            });
            return;
        }
        const data = {
            id: userInfo.id,
            nombre: name,
            correo_electronico: user,
            numero_movil: phone,
            tipo_usuario: type,
        };
        console.log(data);
        try {
            const { status, msg: message} = await callWS({
                endpoint: 'actualizar-usuario',
                method: 'POST',
                data,
            });
            setAlertContent({
                open: true,
                type: status,
                message
            });
            if(status === "success"){
                handleClose();
            }
        } catch (error) {
            setAlertContent({
                open: true,
                type: "error",
                message: "El correo ya está registrado"
            });
        }
    };

    const setOpen = (value) => setAlertContent((prev) => ({ ...prev, open: false }));

    return (
        <Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <Grid container direction="column" alignItems="center" justifyContent="center" justify="center">
                        <Grid item xs={12}>
                            <Typography variant="h4" align="center">Editar usuario</Typography>
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
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={update}>Editar</Button>
                </DialogActions>
            </Dialog>
            <Alert {...alertContent} setOpen={setOpen} />
        </Box>
    );
}

export default UserEdit;
