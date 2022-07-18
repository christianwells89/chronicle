/* eslint-disable react/destructuring-assignment */
import { Box, Flex, Spacer, useColorModeValue, useToast } from '@chakra-ui/react';
import { Controller, useForm, useFormState } from 'react-hook-form';

import type { EntryWithTags } from '~/pages/api/entries';

import { EntryDate } from './date';
import { EntryEditor } from './editor';
import { EntryFooter } from './footer';
import { EntryTags } from './tags';
import { EntryTitle } from './title';

const noop = () => {};

interface ReadOnlyEntry {
  isEditing: false;
  onEdit: () => void;
}

interface EditingEntry {
  isEditing: true;
  onSubmit: (entry: EntryWithTags) => Promise<void>;
  onCancel: () => void;
  onDelete: () => void;
}

type EntryProps = {
  entry?: EntryWithTags;
} & (ReadOnlyEntry | EditingEntry);

export const Entry: React.FC<EntryProps> = (props) => {
  const { isEditing, entry } = props;
  const borderColor = useColorModeValue('gray.200', 'gray.400');
  const toast = useToast();
  const { control, getValues, handleSubmit, register } = useForm<EntryWithTags>({
    defaultValues: { date: new Date(), tags: [], ...entry },
  });
  const { isDirty } = useFormState({ control });

  const showComingSoonToast = () =>
    toast({ title: 'Coming soon!', isClosable: true, position: 'top' });
  // This is not ideal. Ideally this component still gets split up to separate the concerns
  const onEdit = props.isEditing ? noop : props.onEdit;
  const onSubmit = props.isEditing ? props.onSubmit : noop;
  const onCancel = props.isEditing ? props.onCancel : noop;
  const onDelete = props.isEditing ? props.onDelete : noop;

  return (
    <Flex
      px={4}
      direction={{ base: 'column-reverse', md: 'row' }}
      as="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Spacer display={{ base: 'none', lg: 'block' }} flex="1" />
      <Box flex="3 0" maxW="container.md">
        <EntryTitle isEditing={isEditing} register={register} getValues={getValues} />
        <Controller
          name="text"
          control={control}
          render={({ field }) => (
            <EntryEditor text={field.value} isEditing={isEditing} onChange={field.onChange} />
          )}
        />
        <EntryFooter
          isEditing={isEditing}
          hasChanges={isDirty}
          onEdit={onEdit}
          onCancel={onCancel}
          onDelete={onDelete}
          onPhotoAdd={showComingSoonToast}
          onLocationAdd={showComingSoonToast}
        />
      </Box>
      <Box
        flex="1"
        pl={{ base: 0, md: 2 }}
        pt={4}
        pb={4}
        mt="-1em"
        ml={{ base: 0, md: 2 }}
        height="fit-content"
        borderLeftWidth={{ base: '0', md: '2px' }}
        borderLeftColor={borderColor}
      >
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <EntryDate date={field.value} isEditing={isEditing} onChange={field.onChange} />
          )}
        />
        <Box mt={4} pt={4} borderTop="2px" borderTopColor={borderColor}>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <EntryTags tags={field.value} isEditing={isEditing} onChange={field.onChange} />
            )}
          />
        </Box>
      </Box>
    </Flex>
  );
};
