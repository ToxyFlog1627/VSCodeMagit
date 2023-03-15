import {FunctionComponent} from "react";
import styled from "styled-components";
import Group from "../components/Group";
import useFetch from "../hooks/useFetch";

const Text = styled.p``;

const Files: FunctionComponent<{}> = ({}) => {
	const [files] = useFetch<string[]>("GET_UNTRACKED_FILES");
	if (files === null) return null;

	return (
		<Group title="Untracked files" section>
			{files.map(file => (
				<Text>{file}</Text>
			))}
		</Group>
	);
};

export default Files;
