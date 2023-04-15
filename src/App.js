import React from 'react';

// Librería para el enrutamiento
import { Routes, Route, BrowserRouter } from "react-router-dom";

// Layout
import PageLayout from './layouts/PageLayout.jsx';

// Componentes
import Login from './components/user/Login.jsx';

const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <PageLayout>
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        </PageLayout>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
