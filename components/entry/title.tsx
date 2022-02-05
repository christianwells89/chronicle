import { Flex, Heading, Input } from '@chakra-ui/react';
import { UseFormGetValues, UseFormRegister } from 'react-hook-form';

import { EntryWithTags } from '~/pages/api/entries';

interface EntryTitleProps {
  register: UseFormRegister<EntryWithTags>;
  getValues: UseFormGetValues<EntryWithTags>;
  isEditing: boolean;
}

export const EntryTitle: React.VFC<EntryTitleProps> = ({ register, getValues, isEditing }) => {
  const title = getValues('title');
  if (!isEditing && !title) return null;

  return (
    <Flex alignItems="center" h={10} mb={1}>
      {isEditing ? <Input {...register('title')} /> : <Heading size="sm">{title}</Heading>}
    </Flex>
  );
};
