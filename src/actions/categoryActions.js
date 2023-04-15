import callWebService from '../utils/callWS.js';

const loadCategoriasAction = () => callWebService({
    endpoint: 'categoria',
    method: 'GET',
});

const deleteCategoriaAction = (id) => callWebService({
    endpoint: 'eliminar-categoria',
    method: 'DELETE',
    data: { id }
});

const createCategoriaAction = (data) => callWebService({
    endpoint: 'categoria',
    method: 'POST',
    data,
});

const updateCategoriaAction = (data) => callWebService({
    endpoint: 'actualizar-categoria',
    method: 'POST',
    data,
})

export {
    loadCategoriasAction,
    deleteCategoriaAction,
    createCategoriaAction,
    updateCategoriaAction
}