import callWebService from '../utils/callWS.js';

const loginAction = (data) => callWebService({
    endpoint: 'login',
    method: 'POST',
    data,
    secure: false
});

const registerAction = (data) => callWebService({
    endpoint: 'usuario',
    method: 'POST',
    data,
    secure: false
})

export {
    loginAction,
    registerAction
}