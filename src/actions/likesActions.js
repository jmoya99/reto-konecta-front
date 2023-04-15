import callWebService from '../utils/callWS.js';

const loadLikesAction = () => callWebService({
    endpoint: 'likes',
    method: 'GET',
});

const insertLikeAction = (data) => callWebService({
    endpoint: 'likes',
    method: 'POST',
    data,
});

const deleteLikeAction = (data) => callWebService({
    endpoint: 'likes',
    method: 'DELETE',
    data,
});

export {
    loadLikesAction,
    insertLikeAction,
    deleteLikeAction
}