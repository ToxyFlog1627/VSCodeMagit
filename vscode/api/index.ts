import * as branches from './branches';
import * as commits from './commits';
import * as diff from './diff';
import * as error from './error';
import * as files from './files';
import * as remotes from './remotes';
import * as repo from './repo';
import * as staging from './staging';

export type Response = { data: any } | { error: boolean };

const api: { [key: string]: (body: any) => Promise<Response> } = { ...branches, ...commits, ...diff, ...error, ...files, ...repo, ...remotes, ...staging };

export default api;
