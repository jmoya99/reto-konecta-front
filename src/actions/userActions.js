import callWebService from '../utils/callWS.js';

const loadUsersAction = () => callWebService({
    endpoint: 'usuario',
    method: 'GET',
});

const deleteUserAction = (id) => callWebService({
    endpoint: 'eliminar-usuario',
    method: 'DELETE',
    data: { id }
});

const updateUserAction = (data) => callWebService({
    endpoint: 'actualizar-usuario',
    method: 'POST',
    data,
});

const updatePasswordUserAction = (data) => callWebService({
    endpoint: 'actualizar-contrasena',
    method: 'POST',
    data,
});

export {
    loadUsersAction,
    deleteUserAction,
    updateUserAction,
    updatePasswordUserAction
}