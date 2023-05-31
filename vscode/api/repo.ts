import exec from '../exec';
import { execWithoutReturn } from './templates';

export const isInRepo = async () => {
	const { data, error } = await exec('git rev-parse --is-inside-work-tree');
	if (error) return { data: false };
	return { data: data.startsWith('true') };
};

export const initRepo = execWithoutReturn('git init');
