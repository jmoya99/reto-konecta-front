import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const AlertMessage = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Alert = ({ open, message, type, setOpen }) => {

    const handleClose = () => setOpen(false);

    return (<Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <AlertMessage onClose={handleClose} severity={type} sx={{ width: '100%' }}>
            {message}
        </AlertMessage>
    </Snackbar>);
}

export default Alert;