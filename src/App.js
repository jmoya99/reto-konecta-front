import React, { useEffect, useState } from 'react';

// Librería para el enrutamiento
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

// Layout
import PageLayout from './layouts/PageLayout.jsx';

// rutas del aplicativo
import publicRoutes from './routes/public.js';
import privateRoutes from './routes/private.js';

// Contexto para estados globales
import { useAppController } from './context';

const App = () => {

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [controller] = useAppController();

  const { sesionActive } = controller;

  const [routes, setRoutes] = useState(publicRoutes);

  // defino cuales son las rutas publicas
  const publicPages = ['', 'register'];

  useEffect(() => {
    const route = pathname.split("/");
    if(sesionActive && publicPages.includes(route[1])){
      setRoutes(privateRoutes);
      navigate('/inicio');
    }else if(!sesionActive && !publicPages.includes(route[1])){
      setRoutes(publicRoutes);
      navigate('/');
    }
  }, [sesionActive, pathname]);

  return (
    <React.StrictMode>
        <PageLayout>
          <Routes>
            {routes.map((route) => ( <Route path={route.path} element={route.element} key={route.path} />))}
          </Routes>
        </PageLayout>
    </React.StrictMode>
  );
}

export default App;
