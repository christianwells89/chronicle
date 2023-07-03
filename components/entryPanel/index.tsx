import { useBoolean } from '@chakra-ui/react';
import { format, formatISO, parseISO } from 'date-fns';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { fetchJson } from '~/lib/fetchJson';
import { EntryWithTags, SerializedEntryWithTags } from '~/pages/api/entries';
import { Month } from '~/pages/api/entries/months';

import { EditingEntry } from './editing';
import { ReadOnlyEntry } from './readOnly';

// IDEA: make the props a discriminated union on uuid and something to convey a new entry. Then
// there can be a component for an existing entry (read-only or editing) and a new one (editing).
// And it still keeps a single entrypoint into this module

interface ExistingEntryPanelProps {
  uuid: string;
}

interface NewEntryPanelProps {
  isNew: true;
  date?: string;
}

type EntryPanelProps = ExistingEntryPanelProps | NewEntryPanelProps;

export const EntryPanel: React.FC<EntryPanelProps> = (props) => {
  if ('isNew' in props) {
    const { date } = props;

    return <NewEntryPanel date={date} />;
  }

  const { uuid } = props;
  return <ExistingEntryPanel uuid={uuid} />;
};

const ExistingEntryPanel: React.FC<ExistingEntryPanelProps> = ({ uuid }) => {
  const [isEditing, setIsEditing] = useBoolean(false);
  const router = useRouter();
  const { mutate: globalMutate } = useSWRConfig();
  // TODO: handle error state (eg. someone pasted in an incorrect uuid)
  // In other places I haven't been using generics on here because SWR's types are inconsistent
  // with their claims that when using suspense the data should never be undefined, but here I want
  // the mutate function to be type-safe, so I'm forced to deal with it.
  const { data: serializedEntry, mutate } = useSWR<SerializedEntryWithTags>(
    `/api/entries/${uuid}`,
    {
      suspense: true,
    },
  );

  // Without this the editing mode will remain, which results in the form continuing to use the
  // values from the last entry. So if it were submitted like that it would overwrite the new one.
  useEffect(() => {
    setIsEditing.off();
  }, [uuid, setIsEditing]);

  // Should never happen, just to satisfy types
  if (serializedEntry === undefined) throw new Error('Entry not found');

  const entry = {
    ...serializedEntry,
    date: parseISO(serializedEntry.date),
  };
  const handleClose = () => {
    const { query } = router;
    delete query.entry;
    router.push({ query }, undefined, { shallow: true, scroll: false });
  };
  const handleDelete = async () => {
    await fetchJson({ url: `/api/entries/${entry.uuid}`, method: 'DELETE' });
    forceRevalidationOnEntryChange(entry, globalMutate);
    handleClose();
  };
  const handleSubmit = async (editedEntry: EntryWithTags) => {
    await fetchJson({ url: `/api/entries/${editedEntry.uuid}`, body: editedEntry, method: 'PUT' });
    forceRevalidationOnEntryChange(entry, globalMutate);
    mutate(serializeEntry(editedEntry));
    setIsEditing.off();
  };

  return isEditing ? (
    <EditingEntry
      entry={entry}
      onCancel={setIsEditing.off}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
    />
  ) : (
    <ReadOnlyEntry entry={entry} onClose={handleClose} onEdit={setIsEditing.on} />
  );
};

const NewEntryPanel: React.FC<Omit<NewEntryPanelProps, 'isNew'>> = ({ date }) => {
  const entry: EntryWithTags = {
    uuid: '',
    date: date ? parseISO(date) : new Date(),
    title: null,
    text: '',
    tags: [],
  };
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const handleCancel = () => {
    router.push({}, undefined, { shallow: true, scroll: false });
  };
  // IDEA: maybe the entry can react to this being undefined and not show the icon
  const handleDelete = handleCancel;
  const handleSubmit = async (newEntry: EntryWithTags) => {
    const { uuid } = await fetchJson<EntryWithTags>({
      url: '/api/entries',
      body: newEntry,
      method: 'POST',
    });
    forceRevalidationOnEntryChange(newEntry, mutate);
    // This assumes that however the day feed view is implemented it will be similar
    router.push(`?entry=${uuid}`, undefined, { shallow: true, scroll: false });
  };

  return (
    <EditingEntry
      entry={entry}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
    />
  );
};

/**
 * When an entry changes (any CUD operation) it becomes necessary to force any current SWR usages
 * that might contain it to revalidate so that any changes are also propagated there.
 *
 * Right now this is only for any month, but when it becomes possible to view entries by day that
 * will also need to be added.
 */
function forceRevalidationOnEntryChange(entry: EntryWithTags, mutate: (key: string) => void): void {
  const month = format(entry.date, 'yyyy-MM') as Month;
  // It's probably less than ideal that this needs to be done in multiple places, since it's a
  // little weird in what it's doing
  const fullRawDate = parseISO(month);
  const fullDate = formatISO(fullRawDate);

  mutate(`/api/entries?date=${fullDate}`);
}

function serializeEntry(entry: EntryWithTags): SerializedEntryWithTags {
  const { date, ...rest } = entry;
  return { ...rest, date: formatISO(date) };
}
