import { IconButton, Tooltip } from '@chakra-ui/react';
import { LogoutIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';

import { fetchJson } from '~/lib/fetchJson';

export const LogoutButton: React.FC = () => {
  const router = useRouter();

  const onClick = () => {
    // Don't wait on this and just go straight to the login screen for a better experience. It will
    // most likely return very quickly, and logging in again would create a new cookie anyway
    fetchJson({ url: '/api/logout', method: 'POST' });
    router.push('/login');
  };

  return (
    <Tooltip label="Log out">
      <IconButton
        size="sm"
        colorScheme="orange"
        variant="outline"
        borderRadius="full"
        aria-label="Log out"
        icon={<LogoutIcon height={20} />}
        onClick={onClick}
      />
    </Tooltip>
  );
};
