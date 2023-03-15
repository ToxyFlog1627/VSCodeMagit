import {FunctionComponent} from "react";
import Changes from "../components/Changes";
import useFetch from "../hooks/useFetch";

type Props = {};

const StagedChanges: FunctionComponent<Props> = ({}) => {
	const [changes] = useFetch<[string, string, string[][]][]>("GET_STAGED_CHANGES");
	if (changes === null) return null;

	return <Changes title="Staged changes" changes={changes} />;
};

export default StagedChanges;
