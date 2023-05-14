import exec from '../exec';

export const commits = async () => {
	const separator = '|||';
	const { data, error } = await exec(`git log --pretty="format:%h${separator}%B"`);
	if (error) return { error: true };

	const lines = data.split('\n');
	const commits = lines.filter(line => line.includes(separator)).map(line => line.split(separator) as [string, string]);
	return { data: commits };
};

export const commitsNumber = async () => {
	const { data, error } = await exec('git rev-list --all --count');
	if (error) return { error: true };
	return { data: Number(data) };
};

export const commitMessageTemplate = async () => {
	const { data } = await exec("GIT_EDITOR='cat' git commit -e 2> /dev/null");
	return { data };
};

export const commitMessage = async (message: string) => {
	const { error } = await exec(`GIT_EDITOR='echo "${message.split('\n').join('\\n')}" >' git commit -e`);
	if (error) return { error: true };
	return { data: null };
};
