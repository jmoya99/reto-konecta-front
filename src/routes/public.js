// Componentes
import Login from '../components/page/Login.jsx';
import Register from '../components/page/Register.jsx';

export default [
    {
        path: '/',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
];