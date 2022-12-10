import React, {useState, useEffect} from 'react';
import * as d3 from 'd3';
import {findNodeByName, recursiveTraverse} from '../../../utils';
import {NODE_SIZE} from '../common/constants';
import useD3Selection from './useD3Selection';
import useHierarchyGraphSchemaGenerator from './useHierarchyGraphSchemaGenerator';

export default function useHierarchyGraph(graphData: any) {
    const [currentPointerIndex, setCurrentPointerIndex] = useState<number | null>(null);
	const [foundEntitiesCount, setFoundEntitiesCount] = useState<number | null>(null);
    const [prevHighlightedNodes, setPrevHighlightedNodes] = useState<{color: string, id: string, scrollTop: number}[]>([]);

    const {
		makeNodesTransparent,
        highlightCircleNodeById,
        returnCicleNodesToInitialStyles,
        resetOpacityForAllNodes,
        activateAnimationToSelectedCircleNode,
        disableAnimationToSelectedCircleNode,
	} = useD3Selection();

    const {
        generateSchema,
    } = useHierarchyGraphSchemaGenerator();

    const getScrollTop = (node: any) => {
        return (node as Element)?.getBoundingClientRect().y + 
            document.documentElement.scrollTop - (window.innerHeight / 2) - (NODE_SIZE / 2);
    };

    const updateGraphByFoundNode = (foundNode: any) => {
		updateGraph(foundNode);
		setCurrentPointerIndex(null);
	};

    const updateGraphByNotFoundNode = () => {
		returnCicleNodesToInitialStyles(prevHighlightedNodes);
		resetOpacityForAllNodes();
		setFoundEntitiesCount(0);
		setPrevHighlightedNodes([]);
	};

    const movePointer = () => {
		if (foundEntitiesCount) {
			currentPointerIndex === prevHighlightedNodes.length - 1 ?
				setCurrentPointerIndex(0) :
				setCurrentPointerIndex((prev) => prev !== null ? ++prev : prev);
			return;
		}

		setCurrentPointerIndex(null);
	};

    const handleFoundNodeByName = (nodeData: any, foundNodeDepsIds: any): boolean => {
        const foundNodeChildren = nodeData.children;
        
        makeNodesTransparent(nodeData.id, {
            circle: false,
            link: true,
            text: false,
        });

        if (foundNodeChildren && foundNodeChildren.length > 0) {
            recursiveTraverse(
                foundNodeDepsIds,
                foundNodeChildren,
            );
        }
        
        return true;
    };

    const makeNodeTransparent = (foundNodeDepsIds: string[], nodeId: string) => {
        foundNodeDepsIds.includes(nodeId) ?
            makeNodesTransparent(nodeId, {
                circle: false,
                link: false,
                text: false,
            }) :
            makeNodesTransparent(nodeId, {
                circle: true,
                link: true,
                text: true,
            }); 
    };

    const handleGraphNodes = (foundNode: any) => {
        const foundNodeDepsIds: string[] = [];
        const filteredNodes = d3
            .selectAll('text')
            .filter((d: any): any => {
                if (d.data.name === foundNode.name) {
                    return handleFoundNodeByName(d.data, foundNodeDepsIds);
                }

                makeNodeTransparent(foundNodeDepsIds, d.data.id);
            });
        
        return filteredNodes;
    };

    const updateGraph = (foundNode: any) => {
        const filteredNodes = handleGraphNodes(foundNode);
      	setFoundEntitiesCount(filteredNodes.size());
      	const nodesList = filteredNodes.nodes();
        filteredNodes.each(({data: d3Node}: any, i: number) => {
            const {typeData, description, id, type, children} = d3Node;
        	const currentNode = nodesList[i];

			setPrevHighlightedNodes(prev => ([
				...prev,
				{
					id,
                    ...(typeData && {typeData}),
                    ...(description && {description}),
					color: type,
					children,
					scrollTop: getScrollTop(currentNode),
				}
			]));
			highlightCircleNodeById(id);
		});
   	};

    const resetGraph = () => {
        returnCicleNodesToInitialStyles(prevHighlightedNodes);
        resetOpacityForAllNodes();
        setFoundEntitiesCount(null);
        setPrevHighlightedNodes([]);
        disableAnimationToSelectedCircleNode(prevHighlightedNodes[(currentPointerIndex as number)]?.id);
    };

    const resetNodesHighlight = () => {
        if (currentPointerIndex !== null) {
            disableAnimationToSelectedCircleNode(prevHighlightedNodes[(currentPointerIndex as number)].id);
        }
        if (currentPointerIndex === 0) {
            disableAnimationToSelectedCircleNode(prevHighlightedNodes[(currentPointerIndex as number)].id);
        }

        returnCicleNodesToInitialStyles(prevHighlightedNodes);
        setPrevHighlightedNodes([]);
    };

    const handleGraph = (entityName: string, graphData: any) => {
        const foundNode = findNodeByName(entityName, graphData);
        foundNode ? updateGraphByFoundNode(foundNode) : updateGraphByNotFoundNode();
    };

    useEffect(() => {
		if (prevHighlightedNodes.length > 0) {
			setCurrentPointerIndex(0)
		} 
	}, [prevHighlightedNodes]);

	useEffect(() => {
		if (prevHighlightedNodes.length > 0 && currentPointerIndex !== null) {
			const selectedNode = prevHighlightedNodes[currentPointerIndex];
			window.scroll(0, selectedNode.scrollTop);
			if (currentPointerIndex > 0) disableAnimationToSelectedCircleNode(prevHighlightedNodes[currentPointerIndex - 1].id);
			activateAnimationToSelectedCircleNode(selectedNode.id);
		}
	}, [currentPointerIndex]);

    useEffect(() => {
        setPrevHighlightedNodes([]);
    }, [graphData]);

    return {
        handleGraph,
        resetGraph,
        resetNodesHighlight,
        movePointer,
        generateSchema,
        foundEntitiesCount,
        prevHighlightedNodes,
        currentPointerIndex,
    };
}