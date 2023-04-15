import React, { useState, useEffect } from 'react';
import moment from 'moment/moment.js';

// Material ui components
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// Mateiral ui Icons
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockPersonIcon from '@mui/icons-material/LockPerson';

// Material UI DataGrid for Table
import { DataGrid } from '@mui/x-data-grid';

// Mensajes
import Alert from '../../customComponents/Alert.jsx';
import Swal from "sweetalert2";

// import styles
import "./UserStyle.css";

// import utils
import callWebService from '../../utils/callWS';

// components
import UserEdit from './UserEdit.jsx';

const UserList = () => {
    const [usersList, setUsersList] = useState([]);
    const [alertContent, setAlertContent] = useState({});
    const [dialogInfo, setDialogInfo] = useState({});

    const setOpen = (value) => setAlertContent((prev) => ({ ...prev, open: false }));

    const loadData = async () => {
        const { status, msg, users } = await callWebService({
            endpoint: 'usuario',
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
        const usersParse = users.map((user) => (
            {
                ...user,
                fecha_creacion: moment(user['fecha_creacion']),
                fecha_actualizacion: moment(user['fecha_actualizacion']),
                acciones: user.id,
            }
        ))
        setUsersList(users);
    };

    const deleteUser = (id) => {
        Swal.fire({
            title: '¿Está seguro que desea eliminar el usuario?',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: `Cancelar`,
          }).then(async(result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                const { status, msg } = await callWebService({
                    endpoint: 'eliminar-usuario',
                    method: 'DELETE',
                    data: { id }
                });
                setAlertContent({
                    open: true,
                    type: status,
                    message: msg,
                });
                if (status === "success") {
                    loadData();
                }
            }
          })
    };

    const closeModalEdit = () => { 
        setDialogInfo((prev) => ({ ...prev, open: false}));
        loadData();
    };

    const edituser = (user) => {
        setDialogInfo({
            open: true,
            userInfo: user,
            handleClose: closeModalEdit,
        })
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'nombre', headerName: 'Nombre', width: 200 },
        { field: 'correo_electronico', headerName: 'Correo Electronico', editable: true, width: 200 },
        { field: 'numero_movil', headerName: 'Celular', width: 150 },
        { field: 'tipo_usuario', headerName: 'Tipo', width: 150 },
        { field: 'fecha_creacion', headerName: 'Fecha creación', width: 150 },
        { field: 'fecha_actualizacion', headerName: 'Fecha actualización', width: 150 },
        {
            field: 'acciones', headerName: "Acciones", width: 150, renderCell: (param) => (
                <>
                    <Tooltip title="Editar" >
                        <IconButton onClick={() => edituser(param.row)}>
                            <ModeEditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                        <IconButton onClick={() => deleteUser(param.row.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Cambiar contraseña">
                        <IconButton onClick={() => deleteUser(param.row.id)}>
                            <LockPersonIcon />
                        </IconButton>
                    </Tooltip>
                </>
            )
        }
    ];

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            <Box sx={{ height: 400, width: '90%', background: 'rgba(189, 233, 250, 0.8)', ml: '5%', mt: '10px' }}>
                <DataGrid
                    rows={usersList}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                    disableRowSelectionOnClick
                />
            </Box>
            <Alert {...alertContent} setOpen={setOpen} />
            <UserEdit {...dialogInfo} />
        </>
    )
}

export default UserList;