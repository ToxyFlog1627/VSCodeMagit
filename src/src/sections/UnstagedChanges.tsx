import {FunctionComponent} from "react";
import Changes, {Diff} from "../components/Changes";
import useFetch from "../hooks/useFetch";

const UnstagedChanges: FunctionComponent = () => {
	const [changes] = useFetch<Diff>("unstagedChanges");

	if (changes === null || changes.length === 0) return null;
	return <Changes title="Unstaged changes" changes={changes} />;
};

export default UnstagedChanges;
