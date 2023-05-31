import { execAndReturn, execWithoutReturn } from './templates';

const SEPARATOR = '%%%';

export const commits = execAndReturn(`git log --pretty="format:%h${SEPARATOR}%B"`, data => data.split('\n').filter(line => line.includes(SEPARATOR)).map(line => line.split(SEPARATOR))); // prettier-ignore
export const commitsNumber = execAndReturn('git rev-list --all --count', Number);
export const commitMessageTemplate = execAndReturn("GIT_EDITOR='cat' git commit -e 2> /dev/null", data => data, true);
export const commitMessage = execWithoutReturn((message: string) => `GIT_EDITOR='echo "${message}" >' git commit -e`);
