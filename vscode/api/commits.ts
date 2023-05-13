import exec from '../exec';

export const commits = async () => {
	const separator = '|||';
	const { data, error } = await exec(`git log --pretty="format:%h${separator}%B"`);
	if (error) return { error: true };

	const lines = data.split('\n');
	const commits: [string, string][] = [];
	lines.forEach(line => {
		if (!line.includes(separator)) {
			commits[commits.length - 1][1] += '\n' + line;
			return;
		}

		commits.push(line.split(separator) as [string, string]);
	});
	return { data: commits };
};

export const commitMessageTemplate = async () => {
	const { data } = await exec("GIT_EDITOR='cat' git commit -e 2> /dev/null");
	return { data };
};

export const commitsNumber = async () => {
	const { data, error } = await exec('git rev-list --all --count');
	if (error) return { error: true };
	return { data: Number(data) };
};
