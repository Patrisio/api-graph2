import Typography from '@mui/material/Typography';
import { default as MUIToolbar } from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import {useState} from 'react';

export default function Toolbar({
    handleOpen,
    open,
    setFrontApi
}: any) {
    // const [isDemoDataButtonVisible, toggleDemoDataButtonVisible] = useState(true);
    // const loadDemoData = () => {
    //     setFrontApi((window as any).demoData);
    //     toggleDemoDataButtonVisible(!isDemoDataButtonVisible);
    // };

    return (
        <MUIToolbar>
            <Typography variant='h6' noWrap sx={{ flexGrow: 1 }} component='div'>
                Визуализация зависимостей EMRM-API
            </Typography>
            {/* {
                isDemoDataButtonVisible && <Button
                    onClick={loadDemoData}
                    style={{marginRight: 50}}
                    variant='outlined'
                >
                    Загрузить демо-данные
                </Button>
            } */}
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