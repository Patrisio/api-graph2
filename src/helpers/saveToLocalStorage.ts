export const saveToLocalStorage = (fileObject: any, keyInLocalStorage: string) => {
    const yamlFiles = localStorage.getItem(keyInLocalStorage);

    if (yamlFiles) {
        const parsedYamlFiles = JSON.parse(yamlFiles);
        localStorage.setItem(keyInLocalStorage, JSON.stringify([...parsedYamlFiles, fileObject]));
    } else {
        localStorage.setItem(keyInLocalStorage, JSON.stringify([fileObject]));
    }
};