import React from 'react';
import Typography from '@mui/material/Typography';
import { default as MUIToolbar } from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function Toolbar({
    handleOpen,
    open,
}: any) {
    return (
        <MUIToolbar>
            <Typography variant='h6' noWrap sx={{ flexGrow: 1 }} component='div'>
                Визуализация зависимостей EMRM-API
            </Typography>
            <IconButton
                color='inherit'
                aria-label='open drawer'
                edge='end'
                onClick={handleOpen}
                sx={{ ...(open && { display: 'none' }) }}
                style={{position: 'fixed', right: 36}}
            >
                <MenuIcon />
            </IconButton>
        </MUIToolbar>
    );
}