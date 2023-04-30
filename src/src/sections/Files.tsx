import {FunctionComponent} from "react";
import Group from "../components/Group";
import useFetch, {updateSubscribed} from "../hooks/useFetch";
import useSelectable from "../hooks/useSelectable";

type Props = {files: string[]};

const FileList: FunctionComponent<Props> = ({files}) => {
	const selectable = useSelectable({S: () => addAllFiles()});

	const addAllFiles = async () => {
		// TODO: add actual request
		updateSubscribed("untrackedFiles");
		updateSubscribed("stagedChanges");
	};

	const addFile = async (file: string) => {
		// TODO: add actual request
		updateSubscribed("untrackedFiles");
		updateSubscribed("stagedChanges");
	};

	return (
		<>
			{files.map(file => (
				<p ref={selectable({s: () => addFile(file)})}>{file}</p>
			))}
		</>
	);
};

const Files: FunctionComponent = () => {
	const [files] = useFetch<string[]>("untrackedFiles");

	if (files === null) return null;
	return (
		<Group title="Untracked files" section>
			<FileList files={files} />
		</Group>
	);
};

export default Files;
