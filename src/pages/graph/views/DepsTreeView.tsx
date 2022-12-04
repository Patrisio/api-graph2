import React from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

type DepsTreeViewType = {
    children: any,
};

export default function DepsTreeView({
    children,
}: DepsTreeViewType) {
    return (
        <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
            {children}
        </TreeView>
    );
}