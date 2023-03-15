import {FunctionComponent} from "react";
import Group from "../components/Group";
import useFetch from "../hooks/useFetch";

const Files: FunctionComponent<{}> = ({}) => {
	const [files] = useFetch<string[]>("GET_UNTRACKED_FILES");
	if (files === null) return null;

	return (
		<Group title="Untracked files" section>
			{files.map(file => (
				<p>{file}</p>
			))}
		</Group>
	);
};

export default Files;
