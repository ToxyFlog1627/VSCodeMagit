import {FunctionComponent} from "react";
import Group from "../components/Group";
import styled from "styled-components";
import useFetch from "../hooks/useFetch";

type Branch = {
	branch: string;
	commit: string;
};

const Column = styled.div`
	display: flex;
	flex-direction: column;
	margin-right: 3px;
`;

const Text = styled.p``;

const Branches: FunctionComponent<{}> = () => {
	const [branches] = useFetch<{[key: string]: Branch}>("GET_BRANCHES");
	if (branches === null) return null;

	return (
		<Group title="Branches" section>
			<Column>
				<Text>Local: </Text>
				<Text>Remote: </Text>
			</Column>
			<Column>
				<Text>{branches.local.branch}</Text>
				<Text>{branches.remote.branch}</Text>
			</Column>
			<Column>
				<Text>{branches.local.commit}</Text>
				<Text>{branches.remote.commit}</Text>
			</Column>
		</Group>
	);
};

export default Branches;
