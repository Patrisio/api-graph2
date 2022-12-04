import {Routes, Route} from 'react-router-dom';
import Graph from './pages/graph/Graph';
import './App.css';
import {ErrorBoundary} from './components/ErrorBoundary';

export default function App() {
	return (
		<ErrorBoundary>
			<Routes>
				<Route path='/api-graph2/' element={<Graph />} />
			</Routes>
		</ErrorBoundary>
	);
}