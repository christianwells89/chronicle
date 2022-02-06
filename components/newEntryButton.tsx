import { AddIcon } from '@chakra-ui/icons';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { Link } from './link';

export const NewEntryButton: React.VFC = () => {
  const router = useRouter();
  const link = '/entries/new';

  if (router.pathname.endsWith(link)) return null;

  return (
    <Link href={link}>
      <Tooltip label="Add new entry">
        <IconButton
          size="sm"
          colorScheme="orange"
          variant="outline"
          borderRadius="full"
          aria-label="Add new entry"
          icon={<AddIcon />}
        />
      </Tooltip>
    </Link>
  );
};
