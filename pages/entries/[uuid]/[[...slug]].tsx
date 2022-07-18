import { useBoolean } from '@chakra-ui/react';
import { parseISO } from 'date-fns';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import type React from 'react';

import { Entry } from '~/components/entry';
import { prisma } from '~/lib/client';
import { fetchJson } from '~/lib/fetchJson';
import { protectedSsr } from '~/lib/session';
import type { EntryWithTags, SerializedEntryWithTags } from '~/pages/api/entries';

// How this works is the [[...slug]] allows it to match anything in the route. Unfortunately this is
// the only way I can figure out to make it so the entries/:uuid and entries/:uuid/edit routes will
// be serviced by the same page

interface EntryPageProps {
  entry: SerializedEntryWithTags;
}

const EntryPage: NextPage<EntryPageProps> = ({ entry: serializedEntry }) => {
  const router = useRouter();
  const [isEditing, toggleIsEditing] = useBoolean(router.query.slug?.includes('edit'));
  const entry = {
    ...serializedEntry,
    date: parseISO(serializedEntry.date),
  };

  if (isEditing) {
    return <EditPage entry={entry} toggleIsEditing={toggleIsEditing.off} />;
  }
  return <ReadOnlyPage entry={entry} toggleIsEditing={toggleIsEditing.on} />;
};

interface PagePartProps {
  entry: EntryWithTags;
  toggleIsEditing: () => void;
}

const ReadOnlyPage: React.FC<PagePartProps> = ({ entry, toggleIsEditing }) => {
  const router = useRouter();
  const onEdit = () => {
    router.push({ pathname: `/entries/${entry.uuid}/edit` }, undefined, { shallow: true });
    toggleIsEditing();
  };

  return <Entry entry={entry} isEditing={false} onEdit={onEdit} />;
};

const EditPage: React.FC<PagePartProps> = ({ entry, toggleIsEditing }) => {
  const router = useRouter();
  const redirectToReadOnly = () => {
    router.push({ pathname: `/entries/${entry.uuid}` }, undefined, { shallow: true });
    toggleIsEditing();
  };
  const onSubmit = async (editedEntry: EntryWithTags) => {
    await fetchJson({ url: `/api/entries/${editedEntry.uuid}`, body: editedEntry, method: 'PUT' });
    redirectToReadOnly();
  };
  const onDelete = async () => {
    await fetchJson({ url: `/api/entries/${entry.uuid}`, method: 'DELETE' });
    router.push('/');
  };

  return (
    <Entry
      entry={entry}
      isEditing
      onSubmit={onSubmit}
      onCancel={redirectToReadOnly}
      onDelete={onDelete}
    />
  );
};

// It might be more explicit and simple to have separate descrete routes for viewing and editing but
// to do that with server rendering would result in a flash for the page reloading. Therefore using
// client-side loading of the entry would be better, right? Well how next works with loading dynamic
// params locally is that the first render (or few) won't actually have the params yet. So there is
// ugliness involved there too with conditional loading of the entry. Let's see how this method
// evolves

export const getServerSideProps = protectedSsr<EntryPageProps, { uuid: string }>(
  async (context) => {
    const uuid = context.params?.uuid;
    const userId = context.req.session.user.id;
    const entry = await prisma.entry.findFirst({
      where: { uuid, authorId: userId },
      include: { tags: true },
    });
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
  },
);

export default EntryPage;

// Keeping this here for now in case I change my mind and want to go to loading the entry client-side
// const EditPage: NextPage = () => {
//   const router = useRouter();
//   const { uuid } = router.query;
//   const { data, error } = useSWR<SerializedEntryWithTags>(
//     router.isReady ? `/api/entries/${uuid}` : null,
//   );

//   if (error) {
//     return <>Something went wrong loading this entry</>;
//   }
//   if (!data) {
//     return <>Loading...</>;
//   }

//   const entry = {
//     ...data,
//     date: parseISO(data.date),
//   };

//   return <Entry entry={entry} />;
// };
