import { GetServerSideProps, NextPage } from 'next';

import { Entry } from '~/components/entry';
import { prisma } from '~/lib/client';
import type { SerializedEntryWithTags } from '~/pages/api/entries';

interface EntryPageProps {
  entry: SerializedEntryWithTags;
}

// TODO: initial viewing of this page should be in read-only mode if given an actualy uuid. If given
// "new" put it into edit mode straight away

const EntryPage: NextPage<EntryPageProps> = ({ entry }) => <Entry entry={entry} />;

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
