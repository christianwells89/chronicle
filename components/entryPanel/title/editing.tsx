import { Input } from '@chakra-ui/react';
import { UseFormRegister } from 'react-hook-form';

import { EntryWithTags } from '~/pages/api/entries';

interface EditingEntryTitleProps {
  register: UseFormRegister<EntryWithTags>;
}

export const EditingEntryTitle: React.FC<EditingEntryTitleProps> = ({ register }) => (
  <Input {...register('title')} />
);
