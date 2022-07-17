import useSWR from 'swr';

import { UserDTO } from './user';

export function useUser(): [UserDTO | undefined, boolean] {
  const { data } = useSWR<UserDTO>('/api/user');
  const isLoading = data === undefined;
  return [data, isLoading];
}
