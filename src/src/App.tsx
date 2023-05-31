import { FunctionComponent } from 'react';
import useFetch from './hooks/useFetch';
import MainPage from './pages/main';
import CreateRepo from './pages/CreateRepo';

const App: FunctionComponent = () => {
	const repo = useFetch<boolean>('isInRepo');

	if (repo === null) return null;
	if (repo === false) return <CreateRepo />;
	return <MainPage />;
};

export default App;
