import { Box, Divider, Flex, Heading, Spacer, Tag } from '@chakra-ui/react';
import { format, parseISO } from 'date-fns';
import { GetServerSideProps, NextPage } from 'next';

import { EntryEditor } from '~/components/entryEditor';
import { prisma } from '~/lib/client';
import type { SerializedEntryWithTags } from '~/pages/api/entries';

interface EntryPageProps {
  entry: SerializedEntryWithTags;
}

// TODO: initial viewing of this page should be in read-only mode if given an actualy uuid. If given
// "new" put it into edit mode straight away

const EntryPage: NextPage<EntryPageProps> = ({ entry }) => {
  const date = format(parseISO(entry.date), 'EEE d MMM Y');

  return (
    <Flex px={4} direction={{ base: 'column-reverse', md: 'row' }}>
      <Spacer display={{ base: 'none', lg: 'block' }} flex="1" />
      <Box flex="3 0" maxW="container.md">
        <Heading size="sm">{entry.title}</Heading>
        <EntryEditor text={entry.text} isEditable={false} />
      </Box>
      <Divider orientation="vertical" mx={2} h={32} display={{ base: 'none', md: 'block' }} />
      <Box flex="1">
        <Heading size="sm">{date}</Heading>
        <Flex wrap="wrap" my={2}>
          {entry.tags.map((tag) => (
            <Tag key={tag.id} colorScheme="orange" size="sm" mt="auto" mr={1} mb={1}>
              {tag.text}
            </Tag>
          ))}
        </Flex>
      </Box>
    </Flex>
  );
};

type ServerSidePropsGetter = GetServerSideProps<EntryPageProps, { uuid: string }>;

export const getServerSideProps: ServerSidePropsGetter = async (context) => {
  const uuid = context.params?.uuid;
  const entry = await prisma.entry.findFirst({ where: { uuid }, include: { tags: true } });
  if (entry === null) {
    return { notFound: true };
  }

  const serializedEntry = { ...entry, date: entry.date.toISOString() };
  return { props: { entry: serializedEntry } };
};

export default EntryPage;
