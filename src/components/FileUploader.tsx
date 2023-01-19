import React, {useEffect, useState} from 'react';
import {parse} from 'yaml'
import Button from '@mui/material/Button';

export const FileUploader = ({onComplete, label}: any) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const onFileChange = (event: any) => {
        setSelectedFile(event.target.files[0]);
    };

    useEffect(() => {
        (selectedFile as any)?.text().then(
            (text: any) => {
                onComplete(selectedFile, text)
            });
    }, [selectedFile]);

    return (
        <Button variant="contained" component="label">
            {label}
            <input hidden type='file' onChange={onFileChange}/>
        </Button>
    );
};
