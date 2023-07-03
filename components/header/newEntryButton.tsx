import { AddIcon } from '@chakra-ui/icons';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { Link } from '~/components/link';

export const NEW_ENTRIES_PATH = '/entries/feed?entry=new';

export const NewEntryButton: React.FC = () => {
  const router = useRouter();

  if (router.pathname.endsWith(NEW_ENTRIES_PATH)) return null;

  return (
    <Link href={NEW_ENTRIES_PATH}>
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
