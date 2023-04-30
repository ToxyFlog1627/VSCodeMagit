import {FunctionComponent} from "react";
import Changes, {Diff} from "../components/Changes";
import useFetch from "../hooks/useFetch";

const StagedChanges: FunctionComponent = () => {
	const [changes] = useFetch<Diff>("stagedChanges");
	if (changes === null) return null;

	return <Changes title="Staged changes" changes={changes} />;
};

export default StagedChanges;
