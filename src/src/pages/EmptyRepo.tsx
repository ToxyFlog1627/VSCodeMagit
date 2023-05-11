import styled from 'styled-components';

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

const EmptyRepo = () => (
	<Container>
		<Text>There isn't anything in the repo yet!</Text>
	</Container>
);

export default EmptyRepo;
