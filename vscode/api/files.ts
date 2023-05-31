import { execAndReturn, execWithoutReturn } from './templates';

export const addFile = execWithoutReturn((file: string) => `git add ${file}`);
export const addAllFiles = execWithoutReturn('git add $(git ls-files --others --exclude-standard)');
export const untrackedFiles = execAndReturn('git ls-files --others --exclude-standard', data => data.split('\n')?.slice(0, -1) || []);
