import useSWR from 'swr';

import { UserDTO } from '~/lib/user';

export function useUser(): [UserDTO | undefined, boolean] {
  const { data } = useSWR<UserDTO>('/api/user');
  const isLoading = data === undefined;
  return [data, isLoading];
}
