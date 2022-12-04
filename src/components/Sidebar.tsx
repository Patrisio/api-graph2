import React, {ReactElement} from 'react';
import Drawer from './Drawer';

type SidebarProps = {
    onClose: VoidFunction,
    isOpen: boolean,
    children: ReactElement,
};

export default function Sidebar({
    onClose,
    isOpen,
    children,
}: SidebarProps) {
    return (
        <Drawer
            handleClose={onClose}
            open={isOpen}
        >
            {children}
        </Drawer>
    );
}