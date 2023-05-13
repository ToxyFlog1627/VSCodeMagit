import exec from '../exec';

export const diff = async (hash: string) => {
	const { data, error } = await exec(`git show --pretty=format:%b ${hash}`);
	if (error) return { error: true };
	return { data };
};
