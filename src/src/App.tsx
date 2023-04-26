import {createContext, FunctionComponent, useState} from "react";
import {createGlobalStyle} from "styled-components";
import Error from "./components/Error";
import Page from "./sections";

const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
`;

export const ErrorContext = createContext({setError: (error: string) => {}});

type Props = {error?: string};

const App: FunctionComponent<Props> = ({error: _error}) => {
	const [error, setError] = useState<undefined | string>(_error);

	if (error) return <Error>{error}</Error>;

	return (
		<ErrorContext.Provider value={{setError}}>
			<GlobalStyles />
			<Page />
		</ErrorContext.Provider>
	);
};

export default App;
