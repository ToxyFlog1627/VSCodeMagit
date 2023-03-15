import {FunctionComponent} from "react";
import styled from "styled-components";
import Group from "../components/Group";
import useFetch from "../hooks/useFetch";

const Column = styled.div`
	display: flex;
	flex-direction: column;
	margin-right: 2px;
`;

const Hash = styled.p``;

const Text = styled.p``;

type Props = {};

const Commits: FunctionComponent<Props> = ({}) => {
	const [commits] = useFetch<[string, string][]>("GET_COMMITS");
	if (commits === null) return null;

	return (
		<Group title="Recent commits" section>
			<Column>
				{commits.map(([hash]) => (
					<Hash>{hash}</Hash>
				))}
			</Column>
			<Column>
				{commits.map(([_, text]) => (
					<Text>{text}</Text>
				))}
			</Column>
		</Group>
	);
};

export default Commits;
