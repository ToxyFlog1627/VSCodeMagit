import { createContext, FunctionComponent } from 'react';
import { createGlobalStyle } from 'styled-components';
import Page from './sections';
import useFetch from './hooks/useFetch';
import request from './utils/api';
import CreateRepo from './components/CreateRepo';

const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        padding: 0 !important;
    }
`;

export const ErrorContext = createContext({ showError: (error: string) => {} });

const App: FunctionComponent = () => {
	const repo = useFetch<boolean>('isInRepo');

	if (!repo) return <CreateRepo />;
	return (
		<ErrorContext.Provider value={{ showError: message => request('showError', message) }}>
			<GlobalStyles />
			<Page />
		</ErrorContext.Provider>
	);
};

export default App;
