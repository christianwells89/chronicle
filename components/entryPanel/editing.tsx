import { Box, Flex } from '@chakra-ui/react';
import { Controller, useForm, useFormState } from 'react-hook-form';

import { EntryWithTags } from '~/pages/api/entries';

import { EditingEntryDate } from './date/editing';
import { EditingEntryPanelHeader } from './header/editing';
import { EditingEntryTags } from './tags/editing';
import { EditingEntryText } from './text/editing';
import { EditingEntryTitle } from './title/editing';

interface EditingEntryProps {
  entry: EntryWithTags;
  onCancel(): void;
  onSubmit(entry: EntryWithTags): void;
  onDelete(): void;
}

export const EditingEntry: React.FC<EditingEntryProps> = ({
  entry,
  onCancel,
  onSubmit,
  onDelete,
}) => {
  const { control, formState, handleSubmit, register } = useForm<EntryWithTags>({
    defaultValues: entry,
  });
  const { isDirty } = useFormState({ control });

  return (
    <Flex
      direction="column"
      p={4}
      gap={2}
      maxHeight="inherit"
      as="form"
      height="100%"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box>
        <EditingEntryPanelHeader
          isDirty={isDirty}
          isSubmitting={formState.isSubmitting}
          onCancel={onCancel}
          onDelete={onDelete}
        >
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <EditingEntryDate date={field.value} onChange={field.onChange} />
            )}
          />
        </EditingEntryPanelHeader>
      </Box>
      <Box>
        <EditingEntryTitle register={register} />
      </Box>
      <Controller
        name="text"
        control={control}
        render={({ field }) => <EditingEntryText text={field.value} onChange={field.onChange} />}
      />
      <Box>
        <Controller
          name="tags"
          control={control}
          render={({ field }) => <EditingEntryTags tags={field.value} onChange={field.onChange} />}
        />
      </Box>
    </Flex>
  );
};
