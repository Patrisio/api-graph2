import React from 'react';
import IconButton from '@mui/material/IconButton';
import {default as MUIDrawer} from '@mui/material/Drawer';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { styled } from '@mui/material/styles';

export default function Drawer({
    width = 500,
    open,
    handleClose,
    children,
}: any) {
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
     }));

    return (
        <MUIDrawer
            sx={{
                width,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width,
                },
            }}
            variant="persistent"
            anchor="right"
            open={open}
        >
            <DrawerHeader>
                <IconButton onClick={handleClose}>
                    <ChevronRightIcon />
                </IconButton>
            </DrawerHeader>
            {children}
      </MUIDrawer>
    );
}