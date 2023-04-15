import React from 'react';

// Librería para el enrutamiento
import { Routes, Route, BrowserRouter } from "react-router-dom";

// Layout
import PageLayout from './layouts/PageLayout.jsx';

// Componentes
import Login from './components/user/Login.jsx';
import Register from './components/user/Register.jsx';

const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <PageLayout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </PageLayout>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
