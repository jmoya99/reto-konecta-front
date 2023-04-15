// Components
import Dashboard from "../components/dashboard/Dashboard.jsx";
import ArticuloDetail from "../components/articulo/ArticuloDetail.jsx";

export default [
    {
        path: '/inicio',
        element: <Dashboard />
    },
    {
        path: '/articulo/:id/*',
        element: <ArticuloDetail />
    }
];