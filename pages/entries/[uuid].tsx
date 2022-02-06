import { parseISO } from 'date-fns';
import { GetServerSideProps, NextPage } from 'next';

import { Entry } from '~/components/entry';
import { prisma } from '~/lib/client';
import type { SerializedEntryWithTags } from '~/pages/api/entries';

interface EntryPageProps {
  entry: SerializedEntryWithTags;
}

const EntryPage: NextPage<EntryPageProps> = ({ entry: serializedEntry }) => {
  const entry = {
    ...serializedEntry,
    date: parseISO(serializedEntry.date),
  };
  return <Entry entry={entry} />;
};

type ServerSidePropsGetter = GetServerSideProps<EntryPageProps, { uuid: string }>;

export const getServerSideProps: ServerSidePropsGetter = async (context) => {
  const uuid = context.params?.uuid;
  const entry = await prisma.entry.findFirst({ where: { uuid }, include: { tags: true } });
  if (entry === null) {
    return { notFound: true };
  }

  const { id, authorId, ...entryWithoutIds } = entry;
  const serializedEntry = {
    ...entryWithoutIds,
    date: entry.date.toISOString(),
    tags: entry.tags.map((t) => t.text),
  };
  return { props: { entry: serializedEntry } };
};

export default EntryPage;
