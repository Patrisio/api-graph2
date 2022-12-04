export const NODE_SIZE = 10;

export const COLORS = {
    rootNode: {
        type: 'black',
        level: 'yellow',
    },
    pathNode: {
        type: 'red',
        level: 'yellow',
    },
    requestBodyNode: {
        type: 'purple',
        level: 'purple',
    },
    responsesNode: {
        type: 'blue',
        level: 'blue',
    },
    parametersNode: {
        type: 'green',
        level: 'green',
    },
    schemaNode: {
        type: 'orange',
        level: 'orange',
    },
}

export enum METHODS {
    GET = 'get',
    POST = 'post',
};

export const GRAPH_ROOT_CLASS_NAME = 'hierarchy-graph-root';
export const SIDEBAR_WIDTH = 572;
