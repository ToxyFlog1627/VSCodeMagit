import * as _parseDiff from 'parse-diff';
import { execAndReturn } from './templates';

const MAX_DIFF_LENGTH = 10000;
const MAX_HUNK_LENGTH = 2000;

type Diff = {
	from: string;
	to: string;
	hunks: string[][];
};

const parseDiff = (diff: string) =>
	_parseDiff(diff).map(({ chunks, from, to }) => ({
		from,
		to,
		hunks: chunks.map(({ content, changes }) => [content, ...changes.map(({ content }) => content)])
	})) as Diff[];

const truncate = (lines: string[], limit = MAX_DIFF_LENGTH): string[] => (lines.length < limit ? lines : [...lines.slice(0, limit), `--- CAN'T DISPLAY MORE THAN ${limit} LINES --- `]);
const truncateDiff = (diff: Diff[]): Diff[] => diff.map(file => ({ ...file, hunks: file.hunks.map(hunk => truncate(hunk, MAX_HUNK_LENGTH)) }));

export const stagedChanges = execAndReturn('git diff --cached', data => truncateDiff(parseDiff(data)));
export const unstagedChanges = execAndReturn('git diff', data => truncateDiff(parseDiff(data)));
export const diff = execAndReturn((hash: string) => `git show --pretty=format:%b ${hash}`, data => truncate(data.split('\n'))); // prettier-ignore
