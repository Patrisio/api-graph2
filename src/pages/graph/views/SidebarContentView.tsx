import React, {useState, useEffect, useContext} from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {GraphContext} from '../contexts/GraphProvider';
import {GRAPH_RENDERING_STATUS} from '../contexts/types';
import {FileUploader} from '../../../components/FileUploader';
import Autocomplete from '@mui/material/Autocomplete';
import {parse} from 'yaml';
import {Link} from 'react-router-dom';
import {saveToLocalStorage} from '../../../helpers';

type AutocompleteOption = {label: string};

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
    updateNodeName: (nodeName: string) => void,
    setDependencyListToGraphData: (e: any) => void,
    setFrontApi: any;
    autocompleteOptions: AutocompleteOption[];
};

function TabPanel({value, index, children}: any) {
    return (
        <div>
            {value === index && (
                <Box sx={{ pt: 3 }}>
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
    autocompleteOptions,
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

    const preventDefaultByEnterPress = (event: any): boolean => {
        if (event.key !== 'Enter') return false;

        event.preventDefault();
        return true;
    };

    const handleNodeName = (nodeName: string) => {
        if (tabIndex === 0) {
            highlightGraphLinksByNodeName(nodeName, fullGraphData);
        }

        if (tabIndex === 1) {
            setDependencyListToGraphData(nodeName);
        }
    };

    const parseTextAndSetResultToFrontApi = (selectedFile: any, text: string) => {
        saveToLocalStorage(
            {
                fileName: (selectedFile as any).name,
                content: text,
            }, 
            'yamlFiles'
        );
        const apiJson = parse(text);
        setFrontApi(apiJson);
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
            <Button variant="contained" component="label" style={{marginBottom: 10}}>
                <Link to={'/logs-parser'} style={{textDecoration: 'none', color: '#fff'}}>
                    Перейти к парсеру логов
                </Link>
            </Button>
            <FileUploader
                onComplete={parseTextAndSetResultToFrontApi}
                label={'Загрузить файл (.yml/.yaml)'}
            />

            <Tabs value={tabIndex} onChange={switchTabPanel}>
                <Tab label="Full graph" />
                <Tab label="Dependencies graph" />
            </Tabs>

            <TabPanel value={tabIndex} name={'fullGraph'} index={0}>
                <div style={{display: 'flex', width: 400}}>
                    <Autocomplete
                        value={{label: nodeName}}
                        disablePortal
                        options={autocompleteOptions}
                        sx={{ width: 300 }}
                        onChange={(_, reason) => {
                            if (!reason) return;
                            const {label: selectedNodeName} = reason;

                            updateNodeName(selectedNodeName);
                            handleNodeName(selectedNodeName);
                        }}
                        renderInput={(params) => {
                            return <TextField {...params} label='Введите название сущности'
                                onKeyPress={(event: any) => {
                                    const nodeName = event.target.value as string;
                                    updateNodeName(nodeName);
                                    const enterPressed = preventDefaultByEnterPress(event);;
                                    if (!enterPressed) return;
                                    handleNodeName(nodeName);
                                }}
                            />
                        }}
                    />
                    <Button
                        variant="contained"
                        component="label"
                        style={{marginLeft: 10}}
                        onClick={() => handleNodeName(nodeName)}
                    >
                        GO
                    </Button>
                </div>
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
                <Autocomplete
                    value={{label: nodeName}}
                    disablePortal
                    options={autocompleteOptions}
                    sx={{ width: 300 }}
                    onChange={(event) => {
                        const selectedNodeName = event.currentTarget.textContent as string;
                        updateNodeName(selectedNodeName);
                        handleNodeName(selectedNodeName);
                    }}
                    renderInput={(params) => <TextField {...params} label='Введите название сущности' 
                    onKeyPress={(event: any) => {
                        preventDefaultByEnterPress(event);
                    }}
                    />}
                />
            </TabPanel>
         </Box>
    );
}