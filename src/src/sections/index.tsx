import {FunctionComponent} from "react";
import Selection from "../components/Selection";
import Branches from "./Branches";
import Files from "./Files";
import UnstagedChanges from "./UnstagedChanges";
import StagedChanges from "./StagedChanges";
import Commits from "./Commits";
import styled from "styled-components";

const Container = styled.div`
	margin-left: 5px;
	overflow-x: hidden;
	color: var(--vscode-foreground);
`;

const Page: FunctionComponent = () => (
	<Container>
		<Selection />
		<Branches />
		<Files />
		<UnstagedChanges />
		<StagedChanges />
		<Commits />
	</Container>
);

export default Page;
