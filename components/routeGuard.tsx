import { useRouter } from 'next/router';
import { SWRConfig, useSWRConfig } from 'swr';

import { FetchError } from '~/lib/fetchJson';

export const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const swrConfig = useSWRConfig();

  const publicPaths = ['/login'];
  const path = router.asPath.split('?')[0];

  if (publicPaths.includes(path)) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  const onError = (error: unknown) => {
    if (error instanceof FetchError && error.isAuthorisationError) {
      router.push({ pathname: '/login', query: { returnPath: `/${router.asPath}` } });
    }
  };

  return <SWRConfig value={{ ...swrConfig, onError }}>{children}</SWRConfig>;
};
