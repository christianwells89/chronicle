import { Box, Text } from '@chakra-ui/react';
import { Entry } from '@prisma/client';
import { GetServerSideProps } from 'next';

import { prisma } from '~/lib/client';

type SerializedEntry = Omit<Entry, 'date'> & { date: string };

interface EntryPageProps {
  entry: SerializedEntry;
}

const EntryPage = ({ entry }: EntryPageProps) => (
  <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
    <Text>{entry.title}</Text>
    <Text>{entry.text}</Text>
  </Box>
);

type ServerSidePropsGetter = GetServerSideProps<EntryPageProps, { uuid: string }>;

export const getServerSideProps: ServerSidePropsGetter = async (context) => {
  const uuid = context.params?.uuid;
  const entry = await prisma.entry.findFirst({ where: { uuid } });
  if (entry === null) {
    return { notFound: true };
  }

  const serializedEntry = { ...entry, date: entry.date.toISOString() };
  return { props: { entry: serializedEntry } };
};

export default EntryPage;
