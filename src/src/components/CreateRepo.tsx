import styled from 'styled-components';
import { updateSubscribed } from '../hooks/useFetch';
import request from '../utils/api';

const Container = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const Text = styled.p`
	font-size: 24px;
	text-align: center;
	margin: 8px 0;
`;

const Button = styled.button`
	border: none;
	border-radius: 2px;
	padding: 4px 12px;
	color: var(--vscode-button-foreground);
	background: var(--vscode-button-background);
	cursor: pointer;

	&:hover {
		background: var(--vscode-button-hoverBackground);
	}
`;

const CreateRepo = () => {
	const initRepo = () => {
		request('initRepo');
		updateSubscribed('isInRepo');
	};

	return (
		<Container>
			<Text>Workspace isn't a git repository.</Text>
			<Button onClick={initRepo}>Initialize</Button>
		</Container>
	);
};

export default CreateRepo;
