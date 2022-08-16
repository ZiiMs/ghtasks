import { paths } from './schema2';

export type Repo =
  paths['/user/repos']['get']['responses']['200']['content']['application/json'];
