import { customAlphabet } from 'nanoid';

export const nanoid = customAlphabet('abcdefghijklmnopqrstuwxyz', 20);

export const findNodeByName = (entityName: string, data: any): any => {
    let foundNode;

    if (!data.children) return foundNode;

    for (let entityContent of data.children) {
      if (entityContent.name === entityName) {
         foundNode = entityContent;
         break;
      } else {
         foundNode = findNodeByName(entityName, entityContent);
      }

      if (foundNode) {
         return foundNode;
      }
    }

    return foundNode;
};

export const recursiveTraverse = (depsIds: string[], children: any) => {
   if (!children) return;

   for (let node of children) {
      depsIds.push(node.id);
      recursiveTraverse(depsIds, node.children);
   }
};