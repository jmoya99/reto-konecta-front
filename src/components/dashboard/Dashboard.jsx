import React, { useState } from 'react';

// Material ui components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

// Material ui icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

// Contexto para estados globales
import { useAppController, setSesionActive } from '../../context';

// componentes
import UserList from '../user/UserList.jsx';
import CategoryList from '../categoria/CategoryList.jsx';
import ArticuloList from '../articulo/ArticuloList.jsx';

const Dashboard = () => {
    const [controller, dispatch] = useAppController();
    const { userActive } = controller;

    const userIsAdmin = userActive.tipo_usuario == "Administrador";

    const [ view, setView ] = useState('articles');

    const buttonStyle = { my: 2, color: 'white', display: 'block' };

    const showBlock = () => {
        if(view === 'users'){
            return <UserList />
        }
        if(view === 'categories'){
            return <CategoryList />
        }
        return <ArticuloList />
    }

    const changeView = (vista) => setView(vista);

    const logout = () => {
        setSesionActive(dispatch, false);
        localStorage.removeItem("token");
    }

    return (
        <Box>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar disableGutters>
                        <DashboardIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, ml: 1 }} />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Reto Konecta
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {userIsAdmin && (
                                <Button
                                    sx={buttonStyle}
                                    onClick={() => changeView("users")}
                                >
                                    Usuarios
                                </Button>)}
                            <Button
                                sx={buttonStyle}
                                onClick={() => changeView("categories")}
                            >
                                Categorias
                            </Button>
                            <Button
                                sx={buttonStyle}
                                onClick={() => changeView("articles")}
                            >
                                Articulos
                            </Button>
                        </Box>
                        <Box mr={5}>
                            <Typography>
                                <AccountCircleIcon sx={{ mb: -0.5, mr: 0.5 }} />
                                {userActive.nombre}
                                <IconButton sx={{ color: 'white' }} onClick={logout}>
                                    <LogoutIcon/>
                                </IconButton>
                            </Typography>
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
            <Box>
                {showBlock()}
            </Box>
        </Box>
    );
}

export default Dashboard;