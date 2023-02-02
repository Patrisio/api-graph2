import {Routes, Route} from 'react-router-dom';
import Graph from './pages/graph/Graph';
import LogsParser from './pages/logsParser/LogsParser';
import './App.css';
import {ErrorBoundary} from './components/ErrorBoundary';

export default function App() {
	return (
		<ErrorBoundary>
			<Routes>
				<Route path='/' element={<Graph />} />
				<Route path='/logs-parser' element={<LogsParser />} />
			</Routes>
		</ErrorBoundary>
	);
}