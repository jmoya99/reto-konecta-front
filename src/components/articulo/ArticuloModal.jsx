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
import callWebService from '../../utils/callWS.js';

// componentes customizados
import Alert from '../../customComponents/Alert.jsx';


const ArticuloNew = ({ open, handleClose, infoArticulo, newArticulo }) => {
    const [categoriasList, setCategoriesList] = useState([]);
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [shortText, setShortText] = useState('');
    const [longText, setLongText] = useState('');
    const [image, setImage] = useState('');
    const [alertContent, setAlertContent] = useState({});

    useEffect(() => {
        if (!_.isEmpty(infoArticulo) && !newArticulo) {
            setCategory(infoArticulo.id_categoria);
            setTitle(infoArticulo.titulo);
            setShortText(infoArticulo.texto_corto);
            setLongText(infoArticulo.texto_largo);
            setImage(infoArticulo.imagen);
        }
    }, [infoArticulo, newArticulo]);

    const setOpen = (value) => setAlertContent((prev) => ({ ...prev, open: false }));

    const loadCategories = async () => {
        const { status, msg, data } = await callWebService({
            endpoint: 'categoria',
            method: 'GET',
        });
        if (status === "error") {
            setAlertContent({
                open: true,
                type: status,
                message: msg,
            });
            return;
        }
        setCategoriesList(data);
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const validate = () => {
        if (!category.trim()) {
            return {
                msg: "La categoria es obligatoria",
                pass: false
            };
        }
        if (!title.trim()) {
            return {
                msg: "El titulo es obligatorio",
                pass: false
            };
        }
        if (!shortText.trim()) {
            return {
                msg: "El texto corto es obligatorio",
                pass: false
            };
        }
        if (!longText.trim()) {
            return {
                msg: "El texto largo es obligatorio",
                pass: false
            };
        }
        if (!image.trim()) {
            return {
                msg: "La url de la imagen es obligatoria",
                pass: false
            };
        }
        if (!Regex.url.test(image)) {
            return {
                msg: "La URL de la imagen no es valida",
                pass: false
            };
        }
        return { pass: true };
    }

    const crearCategoria = async () => {
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
            id_categoria: category,
            titulo: title,
            texto_corto: shortText,
            texto_largo: longText,
            imagen: image,
        };
        if(!newArticulo){
            data.id_unico = infoArticulo.id_unico;
        }
        try {
            const { status, msg: message} = await callWebService({
                endpoint: newArticulo ? 'articulo' : 'actualizar-articulo',
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
            console.log(error);
            setAlertContent({
                open: true,
                type: "error",
                message: "Error llamando el servicio web"
            });
        }
    }

    return (
        <Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <Grid container direction="column" alignItems="center" justifyContent="center" justify="center">
                        <Grid item xs={12}>
                            <Typography variant="h4" align="center">{newArticulo ? "Crear Articulo" : "Editar Articulo"}</Typography>
                        </Grid>
                        <Grid item xs={8} mt={2}>
                            <Box>
                                <FormControl variant="standard" sx={{ m: 1, width: '50ch' }}>
                                    <InputLabel id="type">Categoria</InputLabel>
                                    <Select
                                        labelId="categoryLabel"
                                        id="categorySelect"
                                        value={category}
                                        label="Categoria"
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        {categoriasList.map((categoria) => (
                                            <MenuItem key={categoria.id} value={categoria.id}>{categoria.titulo}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
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
                                    <InputLabel htmlFor="textoCorto">Texto corto</InputLabel>
                                    <Input
                                        id="textoCorto"
                                        type="text"
                                        value={shortText}
                                        onChange={(e) => setShortText(e.target.value)} />
                                </FormControl>
                            </Box>
                            <Box>
                                <FormControl variant="standard" sx={{ m: 1, width: '50ch' }}>
                                    <TextField
                                        id="textoLargo"
                                        label="Texto Largo"
                                        multiline
                                        rows={5}
                                        defaultValue=""
                                        variant="standard"
                                        value={longText}
                                        onChange={(e) => setLongText(e.target.value)}
                                    />
                                </FormControl>
                            </Box>
                            <Box>
                                <FormControl variant="standard" sx={{ m: 1, width: '50ch' }}>
                                    <InputLabel htmlFor="image">Imagen (URL)</InputLabel>
                                    <Input
                                        id="image"
                                        type="url"
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)} />
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={crearCategoria}>{newArticulo ? "Crear" : "Editar"}</Button>
                </DialogActions>
            </Dialog>
            <Alert {...alertContent} setOpen={setOpen} />
        </Box>
    );
}

export default ArticuloNew;
