import * as React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {FixedSizeList, ListChildComponentProps} from 'react-window';

function renderRow(props: ListChildComponentProps) {
	const {index, style, data} = props;
	const {fileName, content, onClick} = data[index];
	
	return (
		<ListItem style={style} key={index} component="div" disablePadding>
			<ListItemButton onClick={() => onClick(content)}>
				<ListItemText primary={fileName} />
			</ListItemButton>
		</ListItem>
	);
}

export const VirtualizedList = ({items}: any) => {
	return (
		<Box
			sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}
		>
			<FixedSizeList
				height={400}
				width={360}
				itemSize={46}
				itemCount={items.length}
				overscanCount={5}
				itemData={items}
			>
				{renderRow}
			</FixedSizeList>
		</Box>
	);
}