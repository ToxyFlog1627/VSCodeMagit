import {FunctionComponent} from "react";
import Branches from "./Branches";
import Files from "./Files";
import UnstagedChanges from "./UnstagedChanges";
import StagedChanges from "./StagedChanges";
import Commits from "./Commits";
import styled from "styled-components";

const Container = styled.div`
	margin: 0 5px;
`;

const Page: FunctionComponent = () => {
	return (
		<Container>
			<Branches />
			<Files />
			<UnstagedChanges />
			<StagedChanges />
			<Commits />
		</Container>
	);
};

export default Page;
