import callWebService from '../utils/callWS.js';

const loadArticulosAction = () => callWebService({
    endpoint: 'articulo',
    method: 'GET',
});

const deleteArticuloAction = (id) => callWebService({
    endpoint: 'eliminar-articulo',
    method: 'DELETE',
    data: { id_unico: id }
});

const createArticuloAction = (data) => callWebService({
    endpoint: 'articulo',
    method: 'POST',
    data,
});

const updateArticuloAction = (data) => callWebService({
    endpoint: 'actualizar-articulo',
    method: 'POST',
    data,
})

export {
    loadArticulosAction,
    deleteArticuloAction,
    createArticuloAction,
    updateArticuloAction
}