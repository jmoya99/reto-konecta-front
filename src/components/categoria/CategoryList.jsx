import React, { useState, useEffect } from 'react';

// Material ui components
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// Mateiral ui Icons
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// Material UI DataGrid for Table
import { DataGrid } from '@mui/x-data-grid';

// Mensajes
import Alert from '../../customComponents/Alert.jsx';
import Swal from "sweetalert2";

// import utils
import callWebService from '../../utils/callWS';

// Components
import CategoryModal from './CategoryModal.jsx';


const UserList = () => {
    const [categoriesList, setCategoriesList] = useState([]);
    const [alertContent, setAlertContent] = useState({});
    const [dialogInfo, setDialogInfo] = useState({});

    const setOpen = (value) => setAlertContent((prev) => ({ ...prev, open: false }));

    const loadData = async () => {
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

    const deleteCategory = (id) => {
        Swal.fire({
            title: '¿Está seguro que desea eliminar la categoria?',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: `Cancelar`,
        }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                const { status, msg } = await callWebService({
                    endpoint: 'eliminar-categoria',
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
        setDialogInfo((prev) => ({ ...prev, open: false }));
        loadData();
    };

    const openModalCategoryEdit = (category) => {
        setDialogInfo({
            open: true,
            categoryInfo: category,
            handleClose: closeModalEdit,
        })
    }

    const openModalCategoryCreate = () => {
        setDialogInfo({
            open: true,
            newCategory: true,
            handleClose: closeModalEdit,
        })
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'titulo', headerName: 'Titulo', width: 200 },
        { field: 'descripcion', headerName: 'Descripción', width: 800 },
        {
            field: 'acciones', headerName: "Acciones", width: 150, renderCell: (param) => (
                <>
                    <Tooltip title="Editar" >
                        <IconButton onClick={() => openModalCategoryEdit(param.row)}>
                            <ModeEditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                        <IconButton onClick={() => deleteCategory(param.row.id)}>
                            <DeleteIcon />
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
                    rows={categoriesList}
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
            <Tooltip title="Agregar nueva categoria">
                <IconButton
                    sx={{ position: 'absolute', color: 'white', top: '90%', right: '5%' }}
                    onClick={openModalCategoryCreate}
                >
                    <AddCircleIcon fontSize='large' />
                </IconButton>
            </Tooltip>
            <CategoryModal {...dialogInfo} />
        </>
    )
}

export default UserList;