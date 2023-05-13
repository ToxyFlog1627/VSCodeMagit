import { FunctionComponent } from 'react';
import useFetch from '../hooks/useFetch';

const CommitMessageEditor: FunctionComponent = () => {
	const commitMessageTemplate = useFetch<string>('commitMessageTemplate', { disableAutoRefetch: true });

	if (commitMessageTemplate === null) return null;
	return <div>{commitMessageTemplate}</div>;
};

export default CommitMessageEditor;
