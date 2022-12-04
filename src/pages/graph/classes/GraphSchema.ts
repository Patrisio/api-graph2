export default class GraphSchema {
    depListTotal = [];
    prevDepList: any | null = null;
    depList: any = null
    deepLevel = 0;

    generateDependencyList(data: any) {
        this.traverseTree(data.children);

        return this.depList;
    }

    traverseTree(sourceData: any) {
        for (let i = 0; i < sourceData.length; i++) {
            const depItem = sourceData[i];
            const {children: depItemChildren, ...depItemData} = depItem;

            this.deepLevel++;

            if (this.depList) {
                if (this.depList[depItemData.name]) {
                    this.depList = {
                        ...this.depList,
                        [depItemData.name]: {
                            ...this.depList[depItemData.name],
                            children: [
                                this.prevDepList,
                                ...this.depList[depItemData.name].children,
                            ],
                        },
                    };
                    this.prevDepList = {
                        ...depItemData,
                        children: [{...this.prevDepList}],
                    };
                } else {
                    this.depList = {
                        ...this.depList,
                        [depItemData.name]: {
                            ...depItemData,
                            children: this.prevDepList
                                ? [{...this.prevDepList}]
                                : [],
                        },
                    };

                    this.prevDepList = {
                        ...depItemData,
                        children: this.prevDepList
                            ? [{...this.prevDepList}]
                            : [],
                    };
                }
            } else {
                this.depList = {
                    [depItemData.name]: {
                        ...depItemData,
                        children: [],
                    },
                };
                this.prevDepList = {...this.depList[depItemData.name]};
            }
            
            if (!depItemChildren || !depItemChildren.length) {
                this.deepLevel--;
                this.prevDepList = this.prevDepList.children[0];

                continue;
            }

            this.traverseTree(depItemChildren);
            this.deepLevel--;
            this.prevDepList = this.prevDepList.children[0];
        }
    }

    getFilteredDepItems(depList: any, id: string) {
        return depList.filter((depItem: any) => {
            return depItem.id !== id;
        });
    }
}
