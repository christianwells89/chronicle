import { Box, Flex, Spacer, useBoolean, useColorModeValue, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Controller, useForm, useFormState } from 'react-hook-form';

import { fetchJson } from '~/lib/fetchJson';
import type { EntryWithTags } from '~/pages/api/entries';

import { EntryDate } from './date';
import { EntryEditor } from './editor';
import { EntryFooter } from './footer';
import { EntryTags } from './tags';
import { EntryTitle } from './title';

interface EntryProps {
  entry?: EntryWithTags;
}

// TODO: this probably should be split into components for new, editing and readonly, just for clarity
// It would give us the "cancel" functionality by default if it were separate routes too
export const Entry: React.VFC<EntryProps> = ({ entry }) => {
  const [isEditing, { toggle: toggleIsEditing }] = useBoolean(!entry);
  const borderColor = useColorModeValue('gray.200', 'gray.400');
  const toast = useToast();
  const { control, getValues, handleSubmit, register } = useForm<EntryWithTags>({
    defaultValues: { date: new Date(), tags: [], ...entry },
  });
  const { isDirty } = useFormState({ control });
  const router = useRouter();

  const showComingSoonToast = () =>
    toast({ title: 'Coming soon!', isClosable: true, position: 'top' });
  const onSubmit = async (data: EntryWithTags) => {
    if (entry?.uuid) {
      // Right now this is optimistic that it will succeed. Tackle error handling later
      toggleIsEditing();
      fetchJson({ url: `/api/entries/${data.uuid}`, body: data, method: 'PUT' });
    } else {
      const { uuid } = await fetchJson<EntryWithTags>({
        url: '/api/entries',
        body: data,
        method: 'POST',
      });
      router.push(`/entries/${uuid}`);
    }
  };

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
          onEdit={toggleIsEditing}
          // TODO
          onCancel={toggleIsEditing}
          // TODO
          onDelete={toggleIsEditing}
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
