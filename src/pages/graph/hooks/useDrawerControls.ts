import React, {useState} from 'react';

export default function useDrawerControls() {
    const [open, setOpen] = useState<boolean>(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };
  
    const handleDrawerClose = () => {
        setOpen(false);
    };

    return {
        handleDrawerOpen,
        handleDrawerClose,
        isDrawerOpen: open,
    };
}