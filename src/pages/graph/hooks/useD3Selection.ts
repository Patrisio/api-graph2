import React from 'react';
import * as d3 from 'd3';

export default function useD3Selection() {
    const makeNodesTransparent = (
        id: string,
        {
            circle = true,
            link = true,
            text = true
        }: any
    ) => {
        circle ?
            setTransitionOpacityByNodeId(id, 'circle', '.2') :
            setTransitionOpacityByNodeId(id, 'circle', '1');

        link ?
            setTransitionOpacityByNodeId(id, 'link', '.2') :
            setTransitionOpacityByNodeId(id, 'link', '1');

        text ?
            setTransitionOpacityByNodeId(id, 'text', '.2') :
            setTransitionOpacityByNodeId(id, 'text', '1');
    }

    const setTransitionOpacityByNodeId = (id: string, nodeName: string, opacity: string) => {
        d3
            .select(`#${nodeName}-${id}`)
            .transition()
            .duration(700)
            .style('opacity', opacity);
    };

    const highlightCircleNodeById = (id: string) => {
        d3
            .select(`#circle-${id}`)
            .each(function highlightFoundNode() {
                (this as Element).setAttribute('style', `stroke: black; fill: black;`);
            });
    };

    const returnCicleNodesToInitialStyles = (nodes: any) => {
        for (let {color, id} of nodes) {
            d3
                .select(`#circle-${id}`)
                .style('stroke', color)
                .style('fill', color)
        }
    };

    const resetOpacityForAllNodes = () => {
        d3
            .selectAll('text')
            .each((d: any) => {
                makeNodesTransparent(d.data.id, {
                    circle: false,
                    link: false,
                    text: false,
                });
            })
    };

    const activateAnimationToSelectedCircleNode = (id: string) => {
        d3
            .select(`#circle-${id}`)
            .style('animation', 'scaleUp 0.6s ease infinite');
    };

    const disableAnimationToSelectedCircleNode = (id: string) => {
        d3
            .select(`#circle-${id}`)
            .style('animation', 'none');
    };

    const setGraphWidth = (width: number) => {
        d3
            .select('.graph')
            // .transition() // Время данной анимации ломает логику подсвечивания нод в fullGraph
            // .duration(230)
            .style('width', `${width}px`);
    };

    return {
        makeNodesTransparent,
        highlightCircleNodeById,
        returnCicleNodesToInitialStyles,
        resetOpacityForAllNodes,
        activateAnimationToSelectedCircleNode,
        disableAnimationToSelectedCircleNode,
        setGraphWidth,
    };
}