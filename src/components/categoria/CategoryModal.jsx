import _ from 'lodash';

import React, { useEffect, useState } from 'react';

// Material ui components
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';;
import TextField from '@mui/material/TextField';

// utilidades
import Regex from "../../utils/regex.js";
import { createCategoriaAction, updateCategoriaAction } from '../../actions/categoryActions.js';

// componentes customizados
import Alert from '../../customComponents/Alert.jsx';


const CategoryModal = ({ open, categoryInfo, handleClose, newCategory }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [alertContent, setAlertContent] = useState({});

    useEffect(() => {
        if (open) {
            if (!_.isEmpty(categoryInfo) && !newCategory) {
                setTitle(categoryInfo.titulo);
                setDescription(categoryInfo.descripcion);
            } else if (newCategory) {
                setTitle('');
                setDescription('');
            }
        }
    }, [categoryInfo, newCategory, open]);

    const validate = () => {
        if (!title.trim()) {
            return {
                msg: "El titulo es obligatorio",
                pass: false
            };
        }
        if (!description.trim()) {
            return {
                msg: "La descripción es obligatoria",
                pass: false
            };
        }
        return { pass: true };
    };

    const upsert = async (event) => {
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
            titulo: title,
            descripcion: description,
        };
        if (!newCategory) {
            data.id = categoryInfo.id;
        }
        try {
            const { status, msg: message } = await (newCategory
                ? createCategoriaAction(data)
                : updateCategoriaAction(data));
            setAlertContent({
                open: true,
                type: status,
                message
            });
            if (status === "success") {
                setTitle('');
                setDescription('');
                handleClose();
            }
        } catch (error) {
            setAlertContent({
                open: true,
                type: "error",
                message: "Error al llamar al servicio web"
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
                            <Typography variant="h4" align="center">{newCategory ? "Crear Categoria" : "Editar Categoria"}</Typography>
                        </Grid>
                        <Grid item xs={8} mt={2}>
                            <Box>
                                <FormControl variant="standard" sx={{ m: 1, width: '50ch' }}>
                                    <InputLabel htmlFor="titulo">Titulo</InputLabel>
                                    <Input
                                        id="titulo"
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)} />
                                </FormControl>
                            </Box>
                            <Box>
                                <FormControl variant="standard" sx={{ m: 1, width: '50ch' }}>
                                    <TextField
                                        id="descripcion"
                                        label="Descipción"
                                        multiline
                                        rows={5}
                                        defaultValue=""
                                        variant="standard"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={upsert}>{newCategory ? "Crear" : "Editar"}</Button>
                </DialogActions>
            </Dialog>
            <Alert {...alertContent} setOpen={setOpen} />
        </Box>
    );
}

export default CategoryModal;
