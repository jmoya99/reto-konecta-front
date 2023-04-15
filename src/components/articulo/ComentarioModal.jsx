import _ from 'lodash';

import React, { useEffect, useState } from 'react';

// Material ui components
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import IconButton from '@mui/material/IconButton';

// Material ui icons
import FaceIcon from '@mui/icons-material/Face';
import DeleteIcon from '@mui/icons-material/Delete';

// utilidades
import { loadComentarioAction, deleteComentarioAction } from '../../actions/comentarioActions';
import { loadUsersAction } from '../../actions/userActions.js';

// Contexto para estados globales
import { useAppController } from '../../context';

// componentes customizados
import Alert from '../../customComponents/Alert.jsx';

const ComentarioModal = ({ open, handleClose, id_articulo }) => {
    const [comentariosList, setComentariosList] = useState([]);
    const [alertContent, setAlertContent] = useState({});

    const [controller, dispatch] = useAppController();
    const { userActive } = controller;

    useEffect(() => {
        if (open) {
            loadComentarios();
        } else {
            setComentariosList([]);
        }
    }, [id_articulo, open]);


    const loadComentarios = async () => {
        const usersPromise = loadUsersAction();
        const { status, msg, comentarios } = await loadComentarioAction();
        if (status === "error") {
            setAlertContent({
                open: true,
                type: status,
                message: msg,
            });
            return;
        }
        const { status: statusUser, msg: msgUser, users } = await usersPromise;
        if (statusUser === "error") {
            setAlertContent({
                open: true,
                type: statusUser,
                message: msgUser,
            });
            return;
        }
        const comentariosParseados = comentarios
            .filter((comentario) => comentario.id_articulo === id_articulo)
            .map((comentario) => ({
                ...comentario,
                autor: _.get(users.find((user) => user.id === comentario.id_usuario), "nombre"),
                isOwner: _.get(users.find((user) => user.id === comentario.id_usuario), "id") === userActive.id
            }));
        setComentariosList(comentariosParseados);
    };

    const eliminarComentario = async (id) => {
        const { status, msg } = await deleteComentarioAction(id);
        setAlertContent({
            open: true,
            type: status,
            message: msg,
        });
        if (status === "success") {
            loadComentarios();
        }
    }

    const setOpen = (value) => setAlertContent((prev) => ({ ...prev, open: false }));

    return (
        <>
        <Dialog open={open} onClose={handleClose}>
            <DialogContent>
                <Grid container direction="column" alignItems="center" justifyContent="center" justify="center">
                    <Grid item xs={12}>
                        <Typography variant="h4" align="center">Comentarios</Typography>
                    </Grid>
                    <Grid item xs={8} mt={2}>
                        <List sx={{ width: '100%' }}>
                            {comentariosList.length && comentariosList.map((comentario) => (
                                <ListItem key={comentario.id}>
                                    <ListItemAvatar>
                                        <FaceIcon fontSize='large'/>
                                    </ListItemAvatar>
                                    <ListItemText primary={comentario.autor} secondary={comentario.texto} />
                                    {comentario.isOwner && (
                                        <IconButton onClick={() => eliminarComentario(comentario.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cerrar</Button>
            </DialogActions>
        </Dialog>
        <Alert {...alertContent} setOpen={setOpen} />
        </>
    );
}

export default ComentarioModal;
