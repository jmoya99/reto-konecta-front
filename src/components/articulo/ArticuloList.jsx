import _ from 'lodash';

import React, { useEffect, useState } from 'react';

// Material UI Components
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Material UI Icons
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BorderColorIcon from '@mui/icons-material/BorderColor';

// Components
import ArticuloNew from './ArticuloModal.jsx';

// utilidades
import callWebService from '../../utils/callWS.js';

// estilos
import "./ArticleStyle.css";

const dominio = window.location.href.split("/inicio")[0];


const ArticuloList = () => {
    const [categoriesList, setCategoriesList] = useState([]);
    const [articlesList, setArticlesList] = useState([]);
    const [alertContent, setAlertContent] = useState({});
    const [dialogInfo, setDialogInfo] = useState({});

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
        return data;
    };

    const loadArticulos = async () => {
        const loadCategorisePromise = new Promise(async (resolve) => {
            const response = await loadCategories();
            resolve(response);
        });
        const { status, msg, data } = await callWebService({
            endpoint: 'articulo',
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
        const categories = await loadCategorisePromise;
        setCategoriesList(categories);
        const dataParse = data.map((dat) => ({
            ...dat,
            titulo_categoria: _.get(categories.find((category) => category.id === dat.id_categoria), "titulo")
        }));
        setArticlesList(dataParse);
    };

    useEffect(() => {
        loadArticulos();
    }, []);

    const closeModalEdit = () => {
        setDialogInfo((prev) => ({ ...prev, open: false }));
        loadArticulos();
    };

    const openModalArticleEdit = (article) => {
        setDialogInfo({
            open: true,
            infoArticulo: article,
            handleClose: closeModalEdit,
        })
    }

    const openModalArticleCreate = () => {
        setDialogInfo({
            open: true,
            newArticulo: true,
            handleClose: closeModalEdit,
        })
    }

    return (
        <Box m={2}>
            <Grid container mt={5} spacing={1}>
                {articlesList.map((article) => (
                    <Grid item xs={12} md={6} lg={4} key={article.id_unico}>
                        <Card className="Card">
                            <CardContent className="CardContent">
                                <Grid container>
                                    <Grid item xs={4}>
                                        <img
                                            src={article.imagen}
                                            alt={article.titulo}
                                            width="150"
                                            height="150"
                                            className="imagen"
                                        />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography variant="h5">
                                            <b>{article.titulo}</b>
                                            <IconButton onClick={() => openModalArticleEdit(article) }>
                                                <BorderColorIcon />
                                            </IconButton>
                                        </Typography>
                                        <Typography variant="body2"><b>Categoria: </b></Typography>
                                        <Typography variant="body2">{article.titulo_categoria}</Typography>
                                        <Typography variant="body2"><b>Texto corto</b></Typography>
                                        <Typography variant="body2">{article.texto_corto}</Typography>
                                        <Typography variant="body2"><b>slug</b></Typography>
                                        <Typography variant="body2" sx={{ cursor: 'pointer', color: 'blue' }}>{dominio+"/"+article.slug}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Tooltip title="Agregar nuevo articulo">
                <IconButton
                    sx={{ position: 'absolute', color: 'white', top: '90%', right: '5%' }}
                    onClick={openModalArticleCreate}
                >
                    <AddCircleIcon fontSize='large' />
                </IconButton>
            </Tooltip>
            <ArticuloNew {...dialogInfo} />
        </Box>
    )
};

export default ArticuloList;