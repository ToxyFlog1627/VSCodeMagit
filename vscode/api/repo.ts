import exec from '../exec';

export const isInRepo = async () => {
	const { data, error } = await exec('git rev-parse --is-inside-work-tree');
	if (!data || error) return { data: false };
	return { data: data.startsWith('true') };
};

export const initRepo = async () => {
	const { data, error } = await exec('git init');
	if (!data || error) return { error: true };
	return { data: null };
};
