import React, {useEffect, useState} from 'react';
import {HierarchyGraphContainer} from './containers/HierarchyGraphContainer';
import Toolbar from '../../components/Toolbar';
import './Graph.css';
import Sidebar from '../../components/Sidebar';
import SidebarContentContainer from './containers/SidebarContentContainer';
import useDrawerControls from './hooks/useDrawerControls';
import useHierarchyGraph from './hooks/useHierarchyGraph';
import GraphSchema from './classes/GraphSchema';
import {SIDEBAR_WIDTH} from './common/constants';
import {GraphProvider} from './contexts/GraphProvider';
import {parse} from 'yaml'
import {BasicModal} from '../../components/BasicModal';
import {VirtualizedList} from '../../components/VirtualizedList';
import Typography from '@mui/material/Typography';

export default function Graph() {
	const [frontApi, setFrontApi] = useState<any>(null);
	const [graphData, setGraphData] = useState<any>(null);
	const [dependencyListMap, setDependencyListMap] = useState<any>(null);
	const [fullGraphData, setFullGraphData] = useState(null);
	const [hasError, setError] = useState(false);

	const [opened, setOpenFileListModal] = useState(false);
	const handleOpen = () => setOpenFileListModal(true);
	const handleClose = () => setOpenFileListModal(false);

	const [fileList, setFiles] = useState([])

	const {
		handleDrawerOpen,
		handleDrawerClose,
		isDrawerOpen,
	} = useDrawerControls();

	const {
        handleGraph,
        resetGraph,
        resetNodesHighlight,
        movePointer,
		generateSchema,
        foundEntitiesCount,
        prevHighlightedNodes,
        currentPointerIndex,
    } = useHierarchyGraph(graphData);

	useEffect(() => {
		if (!frontApi) return;

		try {
			const hierarchyGraphData = generateSchema(frontApi);
			const graphSchema = new GraphSchema();
			const dependencyListMap = graphSchema.generateDependencyList(hierarchyGraphData);
	
			setDependencyListMap(dependencyListMap);
			setFullGraphData(hierarchyGraphData);
			setGraphData(hierarchyGraphData);
			setError(false);
		} catch (error) {
			setError(true);
		}
	}, [frontApi]);

	useEffect(() => {
		const yamlFileList = localStorage.getItem('yamlFiles');

		if (!yamlFileList) return;

		const parsedYamlFileList = JSON.parse(yamlFileList);

		if (parsedYamlFileList.length === 1) {
			const yamlFile = parsedYamlFileList[0].content;
			const yamlToJson = parse(yamlFile);

			setFrontApi(yamlToJson)
			setError(true);

			return;
		}

		const onListItemClick = (fileContent: string) => {
			const yamlToJson = parse(fileContent);
			setFrontApi(yamlToJson)
			handleClose();
		}

		setFiles(parsedYamlFileList.map((file: any) => ({...file, onClick: onListItemClick})));
		handleOpen();
	}, [])

	return (
		<GraphProvider>
			<Toolbar
				handleOpen={handleDrawerOpen}
				open={isDrawerOpen}
				setFrontApi={setFrontApi}
			/>
			<Sidebar
				onClose={handleDrawerClose}
				isOpen={isDrawerOpen}
			>
				<SidebarContentContainer
					foundEntitiesCount={foundEntitiesCount}
					prevHighlightedNodes={prevHighlightedNodes}
					currentPointerIndex={currentPointerIndex}
					movePointer={movePointer}
					resetNodesHighlight={resetNodesHighlight}
					handleGraph={handleGraph}
					resetGraph={resetGraph}
					updateGraphData={setGraphData}
					setFrontApi={setFrontApi}
					dependencyListMap={dependencyListMap}
					fullGraphData={fullGraphData}
				/>
			</Sidebar>
			{
				hasError &&
				<div style={{textAlign: 'center', marginTop: 50}}>
					<Typography variant='h5' noWrap sx={{ flexGrow: 1 }} component='div'>
						Произошла ошибка при обработке загруженного файла.
					</Typography>
					<Typography variant='h5' noWrap sx={{ flexGrow: 1 }} component='div'>
						Проверьте, что вы загружаете файл формата .yml или .yaml, а также, что он соответствует стандарту OpenAPI 3.0
					</Typography>
				</div>
			}
			<HierarchyGraphContainer
				graphWidth={isDrawerOpen ? window.innerWidth - SIDEBAR_WIDTH + 55 : window.innerWidth} // 55 - дополнительный отступ
				data={graphData}
			/>
			<BasicModal
				opened={opened}
				handleClose={handleClose}
			>
				<VirtualizedList items={fileList} />
			</BasicModal>
		</GraphProvider>
	);
}