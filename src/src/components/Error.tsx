import {FunctionComponent} from "react";
import styled from "styled-components";

const Container = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Text = styled.p`
	font-size: 24px;
	text-align: center;
`;

type Props = {
	children: string;
};

const Error: FunctionComponent<Props> = ({children}) => (
	<Container>
		<Text>{children}</Text>
	</Container>
);

export default Error;
