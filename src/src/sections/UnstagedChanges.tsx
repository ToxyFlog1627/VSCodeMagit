import {FunctionComponent} from "react";
import Changes from "../components/Changes";
import useFetch from "../hooks/useFetch";

const UnstagedChanges: FunctionComponent<{}> = ({}) => {
	const [changes] = useFetch<[string, string, string[][]][]>("GET_UNSTAGED_CHANGES");
	if (changes === null) return null;

	return <Changes title="Unstaged changes" changes={changes} />;
};

export default UnstagedChanges;
