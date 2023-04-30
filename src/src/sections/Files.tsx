import {FunctionComponent, useContext} from "react";
import Group from "../components/Group";
import useFetch, {updateSubscribed} from "../hooks/useFetch";
import useSelectable from "../hooks/useSelectable";
import request from "../utils/api";
import {ErrorContext} from "../App";
import styled from "styled-components";

const Column = styled.div`
	display: flex;
	flex-direction: column;
`;

type Props = {files: string[]};

const FileList: FunctionComponent<Props> = ({files}) => {
	const selectable = useSelectable({S: () => addAllFiles()});
	const {setError} = useContext(ErrorContext);

	const addAllFiles = async () => {
		const {error} = await request("addAllFiles");
		if (error) return setError("Couldn't add files!");
		updateSubscribed("untrackedFiles");
		updateSubscribed("stagedChanges");
	};

	const addFile = async (file: string) => {
		const {error} = await request("addFile", file);
		if (error) return setError("Couldn't add file!");
		updateSubscribed("untrackedFiles");
		updateSubscribed("stagedChanges");
	};

	return (
		<Column>
			{files.map(file => (
				<p ref={selectable({s: () => addFile(file)})}>{file}</p>
			))}
		</Column>
	);
};

const Files: FunctionComponent = () => {
	const [files] = useFetch<string[]>("untrackedFiles");

	if (files === null || files.length === 0) return null;
	return (
		<Group title="Untracked files" section>
			<FileList files={files} />
		</Group>
	);
};

export default Files;
