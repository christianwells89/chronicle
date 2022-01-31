import useSWR from 'swr';

export const fetcher = (url: string) => fetch(url).then((r) => r.json());
export const putter = (url: string, body: Record<string, unknown> = {}) =>
  fetch(url, { method: 'PUT', body: JSON.stringify(body) }).then((r) => r.json());

export function useUser() {
  const { data, mutate } = useSWR('/api/user', fetcher);
  const isLoading = data === undefined;
  const user = data?.user;
  return [user, { mutate, isLoading }];
}
