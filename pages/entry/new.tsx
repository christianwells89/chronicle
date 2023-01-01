import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Entry } from '~/components/entry';
import { fetchJson } from '~/lib/fetchJson';
import { EntryWithTags } from '~/pages/api/entries';

const NewEntryPage: NextPage = () => {
  const router = useRouter();
  const onSubmit = async (entry: EntryWithTags) => {
    const { uuid } = await fetchJson<EntryWithTags>({
      url: '/api/entries',
      body: entry,
      method: 'POST',
    });
    router.push(`/entry/${uuid}`);
  };
  const onCancel = () => {
    router.push('/');
  };

  return <Entry isEditing onSubmit={onSubmit} onCancel={onCancel} onDelete={onCancel} />;
};

export default NewEntryPage;
