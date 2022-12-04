import React, {useState, ChangeEvent} from 'react';
import {isNumber} from 'lodash';
import SidebarContentView from '../views/SidebarContentView';
import {DepsTreeContainer} from './DepsTreeContainer';

type SidebarContentProps = {
    foundEntitiesCount: number | null,
    prevHighlightedNodes: any,
    currentPointerIndex: number | null,
    dependencyListMap: any
    fullGraphData: any;
    movePointer: VoidFunction,
    resetNodesHighlight: VoidFunction,
    handleGraph: (entityName: string, graphData: any) => void,
    resetGraph: VoidFunction,
    setFrontApi: any;
    updateGraphData: any;
};

let prevEntityName: string;

export default function SidebarContentContainer({
    foundEntitiesCount,
    prevHighlightedNodes,
    currentPointerIndex,
    dependencyListMap,
    fullGraphData,
    movePointer,
    resetNodesHighlight,
    handleGraph,
    resetGraph,
    setFrontApi,
    updateGraphData,
}: SidebarContentProps) {
    const depsTreeData = prevHighlightedNodes[currentPointerIndex as number]?.children;
    const rootDepsTreeData = {
        description: prevHighlightedNodes[currentPointerIndex as number]?.description,
        typeData: prevHighlightedNodes[currentPointerIndex as number]?.typeData,
    }
    const isVisibleDepsTree = prevHighlightedNodes.length > 0 && isNumber(currentPointerIndex);
    const [nodeName, setNodeName] = useState<string>('');

    const updateNodeName = (event: ChangeEvent<HTMLInputElement>) => {
        setNodeName(event.target.value);
    };

    const getCurrentPointerIndex = () => {
        if (currentPointerIndex !== null) {
            return currentPointerIndex + 1;
        }
    };

    const setDependencyListToGraphData = (dependencyName: string) => {
        const dependencyList = dependencyListMap[dependencyName];

        if (dependencyList) {
            updateGraphData(dependencyList);
        }
    };

    const setFullGraphData = (fullGraphData: any) => {
        updateGraphData(fullGraphData);
    };

    const highlightGraphLinksByNodeName = (entityName: string, graphData?: any, forceHandleGraph: boolean = false) => {
        if (entityName === '') {
            setNodeName('');
            resetGraph();
            return;
        }

        if (prevEntityName === entityName && forceHandleGraph) {
            movePointer();
            handleGraph(entityName, graphData);
            return;
        }

        if (prevEntityName === entityName) {
            movePointer();
            return;
        }

        if (prevHighlightedNodes.length !== 0) {
            resetNodesHighlight();
        }
        
        handleGraph(entityName, graphData);
        prevEntityName = entityName;
    }

    const getCoincidenceNoticeText = () => {
        return foundEntitiesCount as number > 0 ?
            `Найдено ${foundEntitiesCount} совпадений (${getCurrentPointerIndex()}/${foundEntitiesCount})` :
            'Cовпадений не найдено';
    };

    return (
        <SidebarContentView
            nodeName={nodeName}
            isDisabledResetButton={prevHighlightedNodes.length === 0}
            depsTreeUI={
                <DepsTreeContainer
                    deps={depsTreeData}
                    rootDepsTreeData={rootDepsTreeData}
                    isVisibleDepsTree={isVisibleDepsTree}
                />
            }
            fullGraphData={fullGraphData}
            isVisibleCoincidenceNotice={foundEntitiesCount !== null}
            coincidenceNoticeText={getCoincidenceNoticeText()}
            highlightGraphLinksByNodeName={highlightGraphLinksByNodeName}
            updateNodeName={updateNodeName}
            setDependencyListToGraphData={setDependencyListToGraphData}
            setFullGraphData={setFullGraphData}
            setFrontApi={setFrontApi}
            resetGraph={() => {
                setNodeName('');
                resetGraph();
            }}
        />
    );
}