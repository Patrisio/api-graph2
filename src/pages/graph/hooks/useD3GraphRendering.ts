import {useEffect, useRef, useContext} from 'react';
import * as d3 from 'd3';
import useD3Selection from './useD3Selection';
import {SIDEBAR_WIDTH} from '../common/constants';
import {GraphContext} from '../contexts/GraphProvider';
import {GRAPH_RENDERING_STATUS} from '../contexts/types';

export default function useD3GraphRendering(graphRootNode: string, graphWidth: number, data: any) {
    const {setGraph} = useContext(GraphContext);

    const { current: graphData } = useRef<any>({
        margin: {
            top: 20,
            right: 90,
            bottom: 30,
            left: 90,
        },
        dimensions: {
            width: null,
            height: null,
            x0: null,
            dx: 30,
            dy: null,
        },
        treeMap: null,
        nodes: null,
        groupElement: null,
        nodeElement: null,
    });

    const {setGraphWidth} = useD3Selection();

    const setDimensionsAndMarginsToGraph = (graphWidth: number) => {
        graphData.dimensions.width = graphWidth;
        const nodes: any = d3.hierarchy(data, (d: any) => d.children);
        graphData.nodes = nodes;
        
        graphData.dimensions.dy = (graphData.dimensions.width / (nodes.height + 1));
        d3.tree().nodeSize([graphData.dimensions.dx, graphData.dimensions.dy])(nodes);
    };

    const assignDataToGraph = (data: any) => {
        // const nodes: any = d3.hierarchy(data, (d: any) => d.children);
        // graphData.nodes = graphData.treeMap(nodes);
    };

    const calculateGraphHeight = () => {
        let x0 = Infinity;
        let x1 = -x0;

        const {
            dimensions: {
                dx,
            },
            nodes,
        } = graphData;

        nodes.each((d: any) => {
            if (d.x > x1) {
                x1 = d.x;
            }
            if (d.x < x0) {
                x0 = d.x;
            }
        });
        graphData.dimensions.x0 = x0;
        const height = x1 - x0 + dx * 2;

        graphData.dimensions.height = height;
    };

    const renderGraphContainer = () => {
        let {
            dimensions: {
                width,
                height,
                x0,
                dx,
            },
            margin,
        } = graphData;

        const svg = d3
            .select(`.${graphRootNode}`)
            .append('svg')
                .attr('class', 'graph')
                .attr('viewBox', [0, x0 - dx, width, height])
                .attr("width", width)
                .attr("height", height)
                .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

        graphData.groupElement = svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
    };

    const addLinksBetweendNodes = () => {
        graphData.groupElement
            .selectAll('.link')
            .data(graphData.nodes.descendants().slice(1))
            .enter()
            .append('path')
                .attr('id', (d: any, i: any): any => `link-${d.data.id}`)
                .attr('class', 'link')
                .style('stroke', (d: any) => d.data.level)
                .attr('d', (d: any) => 
                    `M${d.y},${d.x} C${(d.y + d.parent.y) / 2},${d.x} ${(d.y + d.parent.y) / 2},${d.parent.x} ${d.parent.y},${d.parent.x}`
                );
    };

    const addEachNodeAsGroup = () => {
        graphData.nodeElement = graphData.groupElement
            .selectAll('.node')
            .data(graphData.nodes.descendants())
            .enter().append('g')
            .attr('id', (d: any, i: any): any => `group-${d.data.id}`)
            .attr('class', (d: any) => 'node' + (d.children ? ' node--internal' : ' node--leaf'))
            .attr('transform', (d: any) => `translate(${d.y},${d.x})`);
    };

    const addCircleToNode = () => {
        graphData.nodeElement
            .append('circle')
            .attr('id', (d: any, i: any): any => `circle-${d.data.id}`)
            .attr('r', (d: any) => d.data.value)
            .style('stroke', (d: any) => d.data.type)
            .style('fill', (d: any) => d.data.level);
    };

    const addTextToNode = () => {
        graphData.nodeElement
            .append('text')
            .attr('id', (d: any, i: any): any => `text-${d.data.id}`)
            .attr('dy', '.35em')
            .attr('x', (d: any) => d.children ? (d.data.value + 5) * -1 : d.data.value + 5)
            .attr('y', (d: any) => d.children && d.depth !== 0 ? -(d.data.value + 5) : 0)
            .style('text-anchor', (d: any) => d.children ? 'end' : 'start')
            .text((d: any) => d.data.name);
    };

    const renderGraph = (data: any) => {
        setDimensionsAndMarginsToGraph(window.innerWidth);
        assignDataToGraph(data);
        calculateGraphHeight();
        renderGraphContainer();
        addLinksBetweendNodes();
        addEachNodeAsGroup();
        addCircleToNode();
        addTextToNode();

        if (graphWidth === window.innerWidth - SIDEBAR_WIDTH + 55) {
            setGraphWidth(graphWidth);
        }
    };

    const removeGraphContainer = () => {
        d3
            .select(`.${graphRootNode} svg`)
            .remove();
    };

    useEffect(() => {
        if (!data) return;

        removeGraphContainer();
        renderGraph(data);
        setGraph(prev => ({
            ...prev,
            fullGraph: GRAPH_RENDERING_STATUS.RENDERED,
            dependenciesGraph: GRAPH_RENDERING_STATUS.RENDERED,
        }));
    }, [data]);

    useEffect(() => {
        if (!data) return;
        setGraphWidth(graphWidth);
    }, [graphWidth]);
}