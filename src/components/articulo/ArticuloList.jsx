// Material UI Components
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

// Material UI Icons
import AddCircleIcon from '@mui/icons-material/AddCircle';


const ArticuloList = () => {
    return (
        <>
            <Tooltip title="Agregar nuevo articulo">
                <IconButton
                    sx={{ position: 'absolute', color: 'white', top: '90%', right: '5%' }}
                >
                    <AddCircleIcon fontSize='large' />
                </IconButton>
            </Tooltip>
        </>
    )
};

export default ArticuloList;