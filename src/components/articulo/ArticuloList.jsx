import _ from 'lodash';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mensajes
import Alert from '../../customComponents/Alert.jsx';
import Swal from "sweetalert2";

// Material UI Components
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';

// Material UI Icons
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import AddCommentIcon from '@mui/icons-material/AddComment';
import ForumIcon from '@mui/icons-material/Forum';

// Components
import ArticuloNew from './ArticuloModal.jsx';
import ComentarioModal from './ComentarioModal.jsx';

// utilidades
import { loadCategoriasAction } from '../../actions/categoryActions.js';
import { loadArticulosAction, deleteArticuloAction } from '../../actions/articuloActions.js';
import { loadLikesAction, insertLikeAction, deleteLikeAction } from '../../actions/likesActions.js';
import { insertComentarioAction, loadComentarioAction } from '../../actions/comentarioActions.js';

// estilos
import "./ArticleStyle.css";

// Contexto para estados globales
import { useAppController, } from '../../context';

const dominio = window.location.href.split("/inicio")[0];


const ArticuloList = () => {
    const [categoriesList, setCategoriesList] = useState([]);
    const [articlesList, setArticlesList] = useState([]);
    const [alertContent, setAlertContent] = useState({});
    const [dialogInfo, setDialogInfo] = useState({});
    const [currentArticle, setCurrentArticle] = useState({});

    const [controller, dispatch] = useAppController();
    const { userActive } = controller;

    const navigate = useNavigate();

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
        const { likes } = await loadLikesAction();
        const { comentarios } = await loadComentarioAction();
        setCategoriesList(categories);
        const dataParse = data.map((dat) => {
            const likesArticle = likes.filter((like) => like.id_articulo === dat.id_unico);
            const userLike = !!likesArticle.find((like) => like.id_usuario === userActive.id);
            const cantidadComentarios = comentarios.filter((comentario) => comentario.id_articulo === dat.id_unico).length
            return ({
                ...dat,
                titulo_categoria: _.get(categories.find((category) => category.id === dat.id_categoria), "titulo"),
                cantidad_likes: likesArticle.length,
                user_like: userLike,
                cantidad_comentarios: cantidadComentarios,
            })
        });
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

    const deleteArticulo = (id) => {
        Swal.fire({
            title: '¿Está seguro que desea eliminar el articulo?',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: `Cancelar`,
        }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                const { status, msg } = await deleteArticuloAction(id);
                setAlertContent({
                    open: true,
                    type: status,
                    message: msg,
                });
                if (status === "success") {
                    loadArticulos();
                }
            }
        })
    };

    const setOpen = (value) => setAlertContent((prev) => ({ ...prev, open: false }));

    const redirectArticulo = (slug) => navigate("/" + slug);

    const retirarLike = async (id) => {
        const data = {
            id_articulo: id,
            id_usuario: userActive.id
        }
        const { status } = await deleteLikeAction(data);
        if (status === "success") {
            loadArticulos();
        } else {
            setAlertContent({
                open: true,
                type: "error",
                message: "Ocurrió un error, por favor intente nuevamente",
            });
        }
    };

    const darLike = async (id) => {
        const data = {
            id_articulo: id,
            id_usuario: userActive.id
        }
        const { status } = await insertLikeAction(data);
        if (status === "success") {
            loadArticulos();
        } else {
            setAlertContent({
                open: true,
                type: "error",
                message: "Ocurrió un error, por favor intente nuevamente",
            });
        }
    };

    const comentar = (id) => {
        Swal.fire({
            title: 'Ingrese el comentario',
            input: 'text',
            showCancelButton: true,
            confirmButtonText: 'Comentar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!result.value.trim()) {
                    setAlertContent({
                        open: true,
                        type: 'error',
                        message: "El comentario no puede ser vacio"
                    });
                    return;
                }
                const data = {
                    id_articulo: id,
                    id_usuario: userActive.id,
                    texto: result.value,
                };
                try {
                    const { status, msg: message } = await insertComentarioAction(data);
                    setAlertContent({
                        open: true,
                        type: status,
                        message
                    });
                    if(status === "success"){
                        loadArticulos();
                    }
                } catch (error) {
                    setAlertContent({
                        open: true,
                        type: "error",
                        message: error.reason
                    });
                }
            }
        })
    }

    const openModalComentarios = (id) => setCurrentArticle({
        open: true,
        handleClose: handleCloseComments,
        id_articulo: id
    });

    const handleCloseComments = () => { 
        setCurrentArticle((prev) => ({ ...prev, open: false }));
        loadArticulos();
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
                                        <Typography variant="h5"> <b>{article.titulo}</b></Typography>
                                        <Typography variant="body2"><b>Categoria: </b></Typography>
                                        <Typography variant="body2">{article.titulo_categoria}</Typography>
                                        <Typography variant="body2"><b>Texto corto</b></Typography>
                                        <Typography variant="body2">{article.texto_corto}</Typography>
                                        <Typography variant="body2"><b>slug</b></Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ cursor: 'pointer', color: 'blue' }}
                                            onClick={() => redirectArticulo(article.slug)}>{dominio + "/" + article.slug}</Typography>
                                    </Grid>
                                    <Grid item xs={12} mt={1}>
                                        <Tooltip title="Editar articulo">
                                            <IconButton onClick={() => openModalArticleEdit(article)}>
                                                <BorderColorIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar articulo">
                                            <IconButton onClick={() => deleteArticulo(article.id_unico)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="ver más">
                                            <IconButton onClick={() => redirectArticulo(article.slug)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                        {article.user_like ? (
                                            <Tooltip title="Retirar like">
                                                <IconButton onClick={() => retirarLike(article.id_unico)}>
                                                    <Badge badgeContent={<span>{article.cantidad_likes}</span>} color="primary">
                                                        <ThumbUpAltIcon />
                                                    </Badge>
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title="Dar like">
                                                <IconButton onClick={() => darLike(article.id_unico)}>
                                                    <Badge badgeContent={<span>{article.cantidad_likes}</span>} color="primary">
                                                        <ThumbUpOffAltIcon />
                                                    </Badge>
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        <Tooltip title="Agregar comentario">
                                            <IconButton onClick={() => comentar(article.id_unico)}>
                                                <AddCommentIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Ver comentarios">
                                            <IconButton onClick={() => openModalComentarios(article.id_unico)}>
                                                <Badge badgeContent={<span>{article.cantidad_comentarios}</span>} color="success">
                                                    <ForumIcon />
                                                </Badge>
                                            </IconButton>
                                        </Tooltip>
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
            <Alert {...alertContent} setOpen={setOpen} />
            <ComentarioModal {...currentArticle} />
        </Box>
    )
};

export default ArticuloList;