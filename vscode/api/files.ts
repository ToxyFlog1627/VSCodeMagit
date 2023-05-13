import exec from '../exec';

export const addFile = async (file: string) => {
	const { error } = await exec(`git add ${file}`);
	if (error) return { error: true };
	return { data: null };
};

export const addAllFiles = async () => {
	const { error } = await exec('git add $(git ls-files --others --exclude-standard)');
	if (error) return { error: true };
	return { data: null };
};

export const untrackedFiles = async () => {
	const { data, error } = await exec('git ls-files --others --exclude-standard');
	if (error) return { error: true };
	return { data: data.split('\n')?.slice(0, -1) || [] };
};
