import {createContext, FunctionComponent, useState} from "react";
import styled, {createGlobalStyle} from "styled-components";
import Error from "./components/Error";
import Branches from "./sections/Branches";
import Files from "./sections/Files";
import UnstagedChanges from "./sections/UnstagedChanges";
import StagedChanges from "./sections/StagedChanges";
import Commits from "./sections/Commits";

const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
`;

const Container = styled.div`
	padding: 2px;
`;

export const ErrorContext = createContext({setError: (error: string) => {}});

type Props = {
	error?: string;
};

const App: FunctionComponent<Props> = ({error: _error}) => {
	const [error, setError] = useState<undefined | string>(_error);

	if (error) return <Error>{error}</Error>;

	return (
		<Container>
			<GlobalStyles />
			<ErrorContext.Provider value={{setError}}>
				<Branches />
				<Files />
				<UnstagedChanges />
				<StagedChanges />
				<Commits />
			</ErrorContext.Provider>
		</Container>
	);
};

export default App;
