import {METHODS} from './constants';

export interface IHierarchyGraph {
    generateSchema(data: any): void;
    getGraphChildrenNodes(dep: any, options: any): void;
    getDependenciesByPath(pathData: any): void;
    extractDataByMethod(pathData: any, method: METHODS): void;
    extractDataByRef(ref: string): void;
    extractOtherDeps(propertyContent: any, propertyName: string, ref: any): void;
    getAdditionalDataValues(data: any): void;
    getAdditionalData(data: any): void;
    extractParameters({
        requestBodyDeps,
        responsesDeps,
        parametersDepsList,
    }: any): void;
    extractEntityName(ref: string): void;
    handleGraph(entityName: string, foundNodeHandler: any, notFoundNodeHandler: VoidFunction): void;
}