import React, {useState, ChangeEvent, useEffect, useContext} from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {GraphContext} from '../contexts/GraphProvider';
import {GRAPH_RENDERING_STATUS} from '../contexts/types';
import {FileUploader} from '../../../components/FileUploader';

type SidebarContentProps = {
    nodeName: string,
    isDisabledResetButton: boolean,
    isVisibleCoincidenceNotice: boolean,
    coincidenceNoticeText: string,
    fullGraphData: any;
    depsTreeUI: any;
    setFullGraphData: (e: any) => void,
    highlightGraphLinksByNodeName: (nodeName: string, graphData?: any, forceHandleGraph?: boolean) => void,
    resetGraph: VoidFunction,
    updateNodeName: (event: ChangeEvent<HTMLInputElement>) => void,
    setDependencyListToGraphData: (e: any) => void,
    setFrontApi: any;
};

function TabPanel({value, index, children}: any) {
    return (
        <div>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function SidebarContentView({
    nodeName,
    isDisabledResetButton,
    depsTreeUI,
    isVisibleCoincidenceNotice,
    coincidenceNoticeText,
    fullGraphData,
    setFullGraphData,
    updateNodeName,
    highlightGraphLinksByNodeName,
    resetGraph,
    setDependencyListToGraphData,
    setFrontApi,
}: SidebarContentProps) {
    const {fullGraph, setGraph} = useContext(GraphContext);
    const [tabIndex, setTabIndex] = useState(0);
    const switchTabPanel = (_: React.SyntheticEvent, tabIndex: number) => {
        if (tabIndex === 0) {
            setGraph(prev => ({
                ...prev,
                fullGraph: GRAPH_RENDERING_STATUS.NOT_RENDERED,
                dependenciesGraph: GRAPH_RENDERING_STATUS.NOT_RENDERED,
            }))
            setFullGraphData(fullGraphData);
        }

        if (tabIndex === 1 && nodeName) {
            setDependencyListToGraphData(nodeName);
        }

        setTabIndex(tabIndex);
    };

    const handleNodeName = (event: any) => {
        if (event.key !== 'Enter') return;

        event.preventDefault();

        const nodeName = event.target.value;

        if (tabIndex === 0) {
            highlightGraphLinksByNodeName(nodeName, fullGraphData);
        }

        if (tabIndex === 1) {
            setDependencyListToGraphData(nodeName);
        }
    };

    useEffect(() => {
        if (fullGraph === GRAPH_RENDERING_STATUS.RENDERED) {
            highlightGraphLinksByNodeName(nodeName, fullGraphData, true /* forceHandleGraph */);
        }
    }, [fullGraph]);

    return (
        <Box
            component='form'
            sx={{'& > :not(style)': { ml: 3, width: '40ch' }}}
            noValidate
            autoComplete='off'
         >
            <FileUploader onComplete={setFrontApi}/>

            <Tabs value={tabIndex} onChange={switchTabPanel}>
                <Tab label="Full graph" />
                <Tab label="Dependencies graph" />
            </Tabs>

            <TabPanel value={tabIndex} name={'fullGraph'} index={0}>
                <TextField
                    label='Введите название сущности'
                    variant='outlined'
                    onChange={updateNodeName}
                    value={nodeName}
                    onKeyPress={handleNodeName}
                    style={{width: 250}}
                />
                {
                    isVisibleCoincidenceNotice &&
                    <Typography variant='body2' gutterBottom>
                        {coincidenceNoticeText}
                    </Typography>
                }
                <Button
                    variant='text'
                    onClick={resetGraph}
                    disabled={isDisabledResetButton}
                    style={{display: 'block'}}
                >
                    Reset
                </Button>
                {depsTreeUI}
            </TabPanel>
            <TabPanel value={tabIndex} name={'dependenciesGraph'} index={1}>
                <TextField
                    label='Введите название сущности'
                    variant='outlined'
                    onChange={updateNodeName}
                    value={nodeName}
                    onKeyPress={handleNodeName}
                    style={{width: 250}}
                />
            </TabPanel>
         </Box>
    );
}