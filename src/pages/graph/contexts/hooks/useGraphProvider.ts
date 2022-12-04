import {useState, Dispatch, SetStateAction} from 'react';
import {GRAPH_RENDERING_STATUS} from '../types';

type UseGraphProviderType = () => {
    fullGraph: GRAPH_RENDERING_STATUS;
    dependenciesGraph: GRAPH_RENDERING_STATUS;
    setGraph: Dispatch<SetStateAction<{
        fullGraph: GRAPH_RENDERING_STATUS;
        dependenciesGraph: GRAPH_RENDERING_STATUS;
    }>>;
};

export const useGraphProvider: UseGraphProviderType = () => {
    const [graph, setGraph] = useState({
        fullGraph: GRAPH_RENDERING_STATUS.NOT_RENDERED,
        dependenciesGraph: GRAPH_RENDERING_STATUS.NOT_RENDERED,
    });

    return {
        ...graph,
        setGraph,
    }
};
