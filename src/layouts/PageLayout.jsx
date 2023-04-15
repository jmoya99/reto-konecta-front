// Componentes de material UI
import Box from '@mui/material/Box';

// estilos
import "./PageLayoutStyle.css";

const PageLayout = ({ children }) => {
    return (
        <Box className="background">
            {children}
        </Box>
    );
}

export default PageLayout;