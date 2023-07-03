import { Heading } from '@chakra-ui/react';
import { format } from 'date-fns';

export const ReadOnlyEntryDate: React.FC<{ date: Date }> = ({ date }) => (
  <Heading size="sm" flex="1" textAlign="center">
    {format(date, 'E, LLL d, yyyy h:mm b')}
  </Heading>
);
