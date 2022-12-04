import {createContext, FC, SetStateAction} from 'react';
import {useGraphProvider} from './hooks/useGraphProvider';
import {GRAPH_RENDERING_STATUS} from './types';

export const GraphContext = createContext({
    fullGraph: GRAPH_RENDERING_STATUS.NOT_RENDERED,
	dependenciesGraph: GRAPH_RENDERING_STATUS.NOT_RENDERED,
    setGraph: (_: SetStateAction<{
        fullGraph: GRAPH_RENDERING_STATUS;
        dependenciesGraph: GRAPH_RENDERING_STATUS;
    }>) => {},
});

export const GraphProvider: FC = ({
    children,
}) => {
    const graph = useGraphProvider();

    return <GraphContext.Provider value={graph}>{children}</GraphContext.Provider>;
};