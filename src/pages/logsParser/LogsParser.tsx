import {useEffect, useState, useMemo} from 'react';
import {FileUploader} from '../../components/FileUploader';
import {saveToLocalStorage} from '../../helpers';
import CodeMirror from '@uiw/react-codemirror';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

export default function LogsParser() {
    const [parsedJson, setParsedJson] = useState<Record<string, unknown>>({});
    const [selectedLogKey, setSelectedLogKey] = useState('contentBody');
    const [viewportHeight, setViewportHeight] = useState(document.documentElement.clientHeight);
    const [codeMirrorValue, setCodeMirrorValue] = useState('');

    const unescapeAndBeautify = (text: string) => {
        const parsedLog = JSON.parse(text);
        const parsedLogContentBody = JSON.parse(parsedLog.contentBody);
        const result = {
            ...parsedLog,
            contentBody: parsedLogContentBody,
        };
        setParsedJson(result);
        const beautifiedLogString = JSON.stringify(result, null, 2);

        setCodeMirrorValue(beautifiedLogString);
    };

    const addLoadedLogFile = (logFile: any, text: string) => {
        saveToLocalStorage({
            fileName: (logFile as any).name,
            content: text,
        }, 'logFiles');

        unescapeAndBeautify(text);
        setSelectedLogKey('contentBody');
    };

    const handleChange = (e: any) => {
        const selectedLogKey = e.target.value;
        setSelectedLogKey(selectedLogKey);
    };

    const menuItemList = useMemo(() => {
        return ['all', ...Object.keys(parsedJson)].map((logKey) => {
            return (
                <MenuItem key={logKey} value={logKey}>{logKey === 'all' ? 'Весь JSON' : logKey}</MenuItem>
            );
        });
    }, [parsedJson]);

    const copyInBuffer = (text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
    };

    useEffect(() => {
        if (selectedLogKey === 'all') {
            const beautifiedLogString = JSON.stringify(parsedJson, null, 2);
            setCodeMirrorValue(beautifiedLogString);
            copyInBuffer(beautifiedLogString);
            return;
        }

        const logValue = parsedJson[selectedLogKey];
        const beautifiedLogString = JSON.stringify(logValue, null, 2);
        copyInBuffer(beautifiedLogString);
        setCodeMirrorValue(beautifiedLogString);
    }, [selectedLogKey, parsedJson]);

    useEffect(() => {
        const updateViewportHeight = () => {
            const viewportHeight = document.documentElement.clientHeight;
            setViewportHeight(viewportHeight);
        }
        window.addEventListener('resize', updateViewportHeight);

        return () => window.removeEventListener('resize', updateViewportHeight);;
    }, [viewportHeight]);

    return (
        <div style={{display: 'flex'}}>
            <div style={{width: '50%'}}>
                <CodeMirror
                    value={codeMirrorValue}
                    height={`${viewportHeight}px`}
                    width={'100%'}
                    onChange={(value: string) => {
                        setCodeMirrorValue(value);
                    }}
                />
            </div>
            <div style={{width: '50%', marginLeft: 10, display: 'flex', flexDirection: 'column'}}>
                <div style={{width: 300}}>
                    <FileUploader onComplete={addLoadedLogFile} label={'Загрузить файл лога (.log)'} />

                    <Select
                        value={selectedLogKey}
                        label="Log key"
                        onChange={handleChange}
                        style={{marginTop: 10}}
                        fullWidth={true}
                    >
                        {menuItemList}
                    </Select>
                    {
                        codeMirrorValue &&
                        <Button
                            variant="contained"
                            component="label"
                            style={{marginTop: 10}}
                            onClick={() => unescapeAndBeautify(codeMirrorValue)}
                        >
                            Unescape and beautify
                        </Button>
                    }
                </div>
            </div>
        </div>
    );
}
