import callWebService from '../utils/callWS.js';

const loadComentarioAction = () => callWebService({
    endpoint: 'comentario',
    method: 'GET',
});

const insertComentarioAction = (data) => callWebService({
    endpoint: 'comentario',
    method: 'POST',
    data,
});

const deleteComentarioAction = (id) => callWebService({
    endpoint: 'comentario',
    method: 'DELETE',
    data: { id },
});

export {
    loadComentarioAction,
    insertComentarioAction,
    deleteComentarioAction
}