import {METHODS} from './constants';

export const rootNodeName = (data: any) => data.info.title;

export const paths = (data: any) => data.paths;

export const requestBodySelector = (pathData: any, method: METHODS) =>
    pathData[method]?.requestBody?.content['application/json'].schema.$ref;

export const responsesSelector = (pathData: any, method: METHODS) =>
    pathData[method]?.responses['200'].content['application/json'].schema.$ref;

export const parametersSelector = (pathData: any, method: METHODS) => pathData[method]?.parameters;