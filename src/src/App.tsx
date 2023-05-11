import { FunctionComponent } from 'react';
import useFetch from './hooks/useFetch';
import MainPage from './pages/main';
import CreateRepo from './pages/CreateRepo';
import EmptyRepo from './pages/EmptyRepo';

const App: FunctionComponent = () => {
	const repo = useFetch<boolean>('isInRepo');
	const commitsNumber = useFetch<number>('commitsNumber');

	if (repo === null || commitsNumber === null) return null;
	if (!repo) return <CreateRepo />;
	if (commitsNumber === 0) return <EmptyRepo />;
	return <MainPage />;
};

export default App;
