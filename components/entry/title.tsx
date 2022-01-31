import { Flex, Heading, Input } from '@chakra-ui/react';
import { UseFormRegister, UseFormWatch } from 'react-hook-form';

import { EntryWithTags } from '~/pages/api/entries';

interface EntryTitleProps {
  register: UseFormRegister<EntryWithTags>;
  watch: UseFormWatch<EntryWithTags>;
  isEditing: boolean;
}

export const EntryTitle: React.VFC<EntryTitleProps> = ({ register, watch, isEditing }) => {
  const title = watch('title', null);
  if (!isEditing && !title) return null;

  return (
    <Flex alignItems="center" h={10} mb={1}>
      {isEditing ? <Input {...register('title')} /> : <Heading size="sm">{title}</Heading>}
    </Flex>
  );
};
