import { Heading } from '@chakra-ui/react';

export const ReadOnlyEntryTitle: React.FC<{ title: string }> = ({ title }) => (
  <Heading size="sm">{title}</Heading>
);
