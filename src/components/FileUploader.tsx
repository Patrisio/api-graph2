import React, {useEffect, useState} from 'react';
import {parse} from 'yaml'
import Button from '@mui/material/Button';

export const FileUploader = ({onComplete}: any) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const onFileChange = (event: any) => {
        setSelectedFile(event.target.files[0]);
    };

    const saveToLocalStorage = (fileObject: any) => {
        const yamlFiles = localStorage.getItem('yamlFiles');

        if (yamlFiles) {
            const parsedYamlFiles = JSON.parse(yamlFiles);
            localStorage.setItem('yamlFiles', JSON.stringify([...parsedYamlFiles, fileObject]));
        } else {
            localStorage.setItem('yamlFiles', JSON.stringify([fileObject]));
        }
    };

    useEffect(() => {
        (selectedFile as any)?.text().then(
            (text: any) => {
                saveToLocalStorage({
                    fileName: (selectedFile as any).name,
                    content: text,
                });
                
                const apiJson = parse(text);
                onComplete(apiJson)
            });
    }, [selectedFile]);

    return (
        <Button variant="contained" component="label">
            Загрузить файл (.yml/.yaml)
            <input hidden type='file' onChange={onFileChange}/>
        </Button>
    );
};
