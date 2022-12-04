import React from 'react';
import {rootNodeName, paths, requestBodySelector, responsesSelector, parametersSelector} from '../common/selectors';
import {NODE_SIZE, COLORS, METHODS} from '../common/constants';
import {get, isBoolean} from 'lodash';
import {nanoid} from '../../../utils'

let components: any;

export default function useHierarchyGraphSchemaGenerator() {
    const generateSchema = (data: any) => {
        console.log(data);
        components = data.components;

        const rootNode: any = {
            name: rootNodeName(data),
            value: NODE_SIZE,
            id: nanoid(),
            ...COLORS.rootNode,
            children: [],
        };

        for (let [path, pathData] of Object.entries(paths(data))) {
            rootNode.children.unshift({
                name: path,
                value: NODE_SIZE,
                id: nanoid(),
                ...COLORS.pathNode,
                children: [],
            });

            const {
                extractedData: {
                    requestBody,
                    responses,
                    parameters, 
                },
                entityName,
            }: any = getDependenciesByPath(pathData);

            const deps = [
                {
                    name: entityName.requestBody,
                    list: requestBody,
                    color: COLORS.requestBodyNode,
                },
                {
                    name: entityName.responses,
                    // Может приходить как [{paging}, {data}], так и [{data}]. В случае если приходит только data, то не отображаем его в графе
                    list: responses.length > 1 ? responses : responses[0].children,
                    color: COLORS.responsesNode,
                },
                {
                    name: 'parameters',
                    list: parameters,
                    color: COLORS.parametersNode,
                },
            ];

            for (let dep of deps) {
                if (!dep.list.length) continue;

                const options = {
                    name: dep.name,
                    value: NODE_SIZE,
                    ...dep.color,
                };

                rootNode.children[0].children.push({
                    ...options,
                    id: nanoid(),
                    ...getGraphChildrenNodes(dep.list, {
                        ...options,
                        id: nanoid(),
                        ...(
                            dep.name === 'parameters' ?
                                COLORS.parametersNode :
                                COLORS.schemaNode
                            ),
                    }),
                });
            }
        }
        console.log(rootNode, '__rootNode__');

        return rootNode;
    }

    const getGraphChildrenNodes = (dep: any, options: any) => {
        for (let [i, depItem] of dep.entries()) {
            depItem = {
                ...options,
                id: nanoid(),
                ...depItem,
            };
            dep[i] = depItem;

            const children = depItem.children;
            if (children?.length > 0) {
                getGraphChildrenNodes(children, options);
            }
        }

        return { children: dep };
    }

    const getDependenciesByPath = (pathData: any) => {
        const {POST, GET} = METHODS;

        switch (Object.keys(pathData)[0]) {
            case POST:
                return extractDataByMethod(pathData, POST);
            case GET:
                return extractDataByMethod(pathData, GET);
            default: 
                return;
        }
    }

    const extractDataByMethod = (pathData: any, method: METHODS) => {
        const requestBodyRef = requestBodySelector(pathData, method);
        const requestBodyDeps = extractDataByRef(requestBodyRef);
        const requestBodyEntityName = extractEntityName(requestBodyRef);

        const responsesRef = responsesSelector(pathData, method);
        const responsesDeps = extractDataByRef(responsesRef);
        const responsesEntityName = extractEntityName(responsesRef);

        const parametersRefsList = parametersSelector(pathData, method);
        const parametersDepsList = [];

        if (parametersRefsList) {
            for (let {$ref: ref} of parametersRefsList) {
                const parametersDeps = extractDataByRef(ref);
                parametersDepsList.push(parametersDeps);
            }
        }

        const {
            requestBodyDepsParameters,
            responsesDepsParameters,
        } = extractParameters({
            requestBodyDeps,
            responsesDeps,
            parametersDepsList,
        });
        const extractedData = {
            requestBody: requestBodyDepsParameters,
            responses: responsesDepsParameters,
            parameters: parametersDepsList,
        };

        return {
            extractedData,
            entityName: {
                requestBody: requestBodyEntityName,
                responses: responsesEntityName,
            },
        };
    }

    const extractDataByRef = (ref: string) => {
        if (!ref) return null;
        
        const requestBodyRef =
            ref
                .split('/')
                .slice(2)
                .join('.');
        const requestBodyDeps = get(components, requestBodyRef, null);
        return requestBodyDeps;
    }

    const extractOtherDeps = (propertyContent: any, propertyName: string, ref: any) => {
        if (propertyContent.$ref) {
            const entityContent: any = extractDataByRef(propertyContent.$ref);

            if (entityContent?.properties) {
                const propsEntities = Object.entries(entityContent.properties);

                for (let [propsName, propsContent] of propsEntities) {
                    const propertyData = (propsContent as any).items || propsContent;

                    ref.unshift({
                        name: propsName,
                        id: nanoid(),
                        ...getAdditionalData(propsContent),
                        children: [],
                    });

                    extractOtherDeps(propertyData, propsName, ref[0].children);
                }
            }
        }
    }

    const getAdditionalDataValues = (data: any) => {
        const description = (data as any).description;
        const maxItems = (data as any).maxItems;
        const maxLength = (data as any).maxLength;
        const pattern = (data as any).pattern;
        const typeData = (data as any).type;
        const required = (data as any).required;
        const additionalProperties = (data as any).additionalProperties;

        const additionalData = {
            ...(description && { description }),
            ...(maxItems && { maxItems }),
            ...(maxLength && { maxLength }),
            ...(pattern && { pattern }),
            ...(typeData && { typeData }),
            ...(required && { required }),
            ...(isBoolean(additionalProperties) && { additionalProperties }),
        };

        return additionalData;
    }

    const getAdditionalData = (data: any) => {
        if (data.$ref) {
            const entityContent: any = extractDataByRef(data.$ref);
            if (!entityContent?.properties) {
                return getAdditionalDataValues(entityContent);
            }
        }

        return getAdditionalDataValues(data);
    };

    const extractParameters =({
        requestBodyDeps,
        responsesDeps,
        parametersDepsList,
    }: any) =>  {
        const propertiesRequestBodyRefsList = [];
        if (requestBodyDeps?.properties) {
            const propertiesRequestBody = Object.entries(requestBodyDeps.properties);
            
            for (let [propsName, propsContent] of propertiesRequestBody) {
                const propertyData = (propsContent as any).items || propsContent;
                
                let ref = {
                    name: propsName,
                    id: nanoid(),
                    ...getAdditionalData(propsContent),
                    children: [],
                };

                extractOtherDeps(propertyData, propsName, ref.children);
                propertiesRequestBodyRefsList.push(ref);
            }
        }

        const propertiesResponsesDepsRefsList: any = [];
        if (responsesDeps.properties) {
            const propertiesResponsesDeps = Object.entries(responsesDeps.properties);

            for (let [propsName, propsContent] of propertiesResponsesDeps) {
                const propertyData = (propsContent as any).items || propsContent;
                let ref = {
                    name: propsName,
                    id: nanoid(),
                    ...getAdditionalData(propertyData),
                    children: [],
                };

                extractOtherDeps(propertyData, propsName, ref.children);
                propertiesResponsesDepsRefsList.push(ref);
            }
        } else {
            const universalResponseEntityContent: any = extractDataByRef(responsesDeps.allOf[0].$ref);
            const propertiesResponsesDeps = Object.entries(universalResponseEntityContent.properties);

            for (let [propsName, propsContent] of propertiesResponsesDeps) {
                const propertyData = (propsContent as any).items || propsContent;
                let ref = {
                    name: propsName,
                    id: nanoid(),
                    ...getAdditionalData(propsContent),
                    children: [],
                };

                extractOtherDeps(propertyData, propsName, ref.children);
                propertiesResponsesDepsRefsList.push(ref);
            }
        }

        return {
            requestBodyDepsParameters: propertiesRequestBodyRefsList,
            responsesDepsParameters: propertiesResponsesDepsRefsList,
        };
    }

    const extractEntityName = (ref: string) => {
        if (!ref) return null;

        const requestBodyRefArray = ref.split('/');
        const entityName = requestBodyRefArray[requestBodyRefArray.length - 1];
        return entityName;
    }

    return {
        generateSchema,
    };
}