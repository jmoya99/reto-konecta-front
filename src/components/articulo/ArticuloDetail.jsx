import _ from 'lodash';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

// Material ui components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import CircularProgress from '@mui/material/CircularProgress';

// Material UI Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

// utilidades
import { loadCategoriasAction } from '../../actions/categoryActions.js';
import { loadArticulosAction } from '../../actions/articuloActions.js';

// Contexto para estados globales
import { useAppController, setSesionActive } from '../../context';

const dominio = window.location.href.split("/articulo")[0];


const ArticuloDetail = () => {

    const [articlesList, setArticlesList] = useState([]);
    const [articuloActual, setArticuloActual] = useState({});
    const [categoriesList, setCategoriesList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [controller, dispatch] = useAppController();
    const { userActive } = controller;

    const params = useParams();
    const navigate = useNavigate();

    const logout = () => {
        setSesionActive(dispatch, false);
        localStorage.removeItem("token");
    }

    const loadCategories = async () => {
        const { status, msg, data } = await loadCategoriasAction();
        if (status === "error") {
            setAlertContent({
                open: true,
                type: status,
                message: msg,
            });
            return;
        }
        return data;
    };

    const loadArticulos = async () => {
        setLoading(true);
        console.log("llamados", params.id);
        const loadCategorisePromise = loadCategories();
        const { status, msg, data } = await loadArticulosAction();
        if (status === "error") {
            setAlertContent({
                open: true,
                type: status,
                message: msg,
            });
            return;
        }
        const categories = await loadCategorisePromise;
        setCategoriesList(categories);
        const dataParse = data.map((dat) => ({
            ...dat,
            titulo_categoria: _.get(categories.find((category) => category.id === dat.id_categoria), "titulo")
        }));
        console.log(dataParse);
        setArticlesList(dataParse);
        const actual = dataParse.find((data) => data.id_unico === params.id);
        if (_.isEmpty(actual)) {
            setAlertContent({
                open: true,
                type: "error",
                message: "Articulo no encontrado",
            });
            return;
        }
        setArticuloActual(actual);
        setLoading(false);
    };

    useEffect(() => {
        loadArticulos();
    }, [params.id]);

    const navigateBack = () => navigate("/");

    const redirectArticulo = (slug) => navigate("/" + slug);

    return !loading ? (
        <Box>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar disableGutters>
                        <IconButton sx={{ color: 'white' }} onClick={navigateBack}>
                            <ArrowBackIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, ml: 1 }} />
                        </IconButton>
                        <Typography variant="body1" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={navigateBack}>
                            Volver
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                {articuloActual.titulo}
                            </Typography>
                        </Box>
                        <Box mr={5}>
                            <Typography>
                                <AccountCircleIcon sx={{ mb: -0.5, mr: 0.5 }} />
                                {userActive.nombre}
                                <IconButton sx={{ color: 'white' }} onClick={logout}>
                                    <LogoutIcon />
                                </IconButton>
                            </Typography>
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
            <Box sx={{ m: 5 }}>
                <Grid container>
                    <Grid item xs={8}>
                        <Grid container>
                            <Grid item xs={4}>
                                <img
                                    src={articuloActual.imagen}
                                    alt={articuloActual.titulo}
                                    width="250"
                                    height="250"
                                    className="imagen"
                                />
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="h3">Información general</Typography>
                                <Typography variant="body1"><b>Titulo: </b></Typography>
                                <Typography variant="body1">{articuloActual.titulo}</Typography>
                                <Typography variant="body1"><b>Categoria: </b></Typography>
                                <Typography variant="body1">{articuloActual.titulo_categoria}</Typography>
                                <Typography variant="body1"><b>Texto corto</b></Typography>
                                <Typography variant="body1">{articuloActual.texto_corto}</Typography>
                                <Typography variant="body1"><b>slug</b></Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ cursor: 'pointer', color: 'blue' }}
                                >{dominio + "/" + articuloActual.slug}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h3">Información complementaria</Typography>
                                <Typography variant="body1"><b>ID del articulo: </b></Typography>
                                <Typography variant="body1">{articuloActual.id_unico}</Typography>
                                <Typography variant="body1"><b>ID de la Categoria: </b></Typography>
                                <Typography variant="body1">{articuloActual.id_categoria}</Typography>
                                <Typography variant="body1"><b>Texto Largo</b></Typography>
                                <Typography variant="body1">{articuloActual.texto_largo}</Typography>
                                <Typography variant="body1"><b>URL de la imagen</b></Typography>
                                <Typography variant="body1">
                                    <a href={articuloActual.imagen}>
                                        {articuloActual.imagen}
                                    </a>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="h3">Otros Articulos</Typography>
                        <List sx={{ width: '100%', background: 'rgba(189, 233, 250, 0.8)' }}>
                            {articlesList.length && articlesList.map((article) => article.id_unico !== articuloActual.id_unico && (
                                <ListItem key={article}>
                                    <ListItemAvatar>
                                        <img
                                            src={article.imagen}
                                            alt={article.titulo}
                                            width="50"
                                            height="50"
                                            className="imagen"
                                        />
                                    </ListItemAvatar>
                                    <ListItemText primary={article.titulo} secondary={<Typography
                                        sx={{ cursor: 'pointer', color: 'blue' }}
                                        onClick={() => redirectArticulo(article.slug)}>{dominio + "/" + article.slug}</Typography>} />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    ) : (<CircularProgress />)

}

export default ArticuloDetail;