import { CheckIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, ButtonGroup, Flex, IconButton, useDisclosure, useToken } from '@chakra-ui/react';
import { ArchiveIcon } from '@heroicons/react/outline';

import { DangerConfirmModal } from '~/components/dangerConfirmModal';
import { Tooltip } from '~/components/tooltip';

interface EditingHeaderProps {
  isDirty: boolean;
  isSubmitting: boolean;
  children: React.ReactNode;
  onCancel(): void;
  onDelete(): void;
}

export const EditingEntryPanelHeader: React.FC<EditingHeaderProps> = ({
  isDirty,
  isSubmitting,
  children,
  onCancel,
  onDelete,
}) => {
  const confirmDiscardChangesModal = useDisclosure();
  const confirmDeleteModal = useDisclosure();
  const fontSize = useToken('fontSizes', 'sm');

  return (
    <Flex alignItems="center">
      <Box ml={-2}>
        <Tooltip label="Discard changes">
          <IconButton
            isDisabled={isSubmitting}
            variant="ghost"
            size="md"
            aria-label="Discard changes"
            icon={<ArchiveIcon height={fontSize} />}
            onClick={isDirty ? confirmDiscardChangesModal.onOpen : onCancel}
          />
        </Tooltip>
        <DangerConfirmModal
          isOpen={confirmDiscardChangesModal.isOpen}
          context="discard the changes you've made"
          consequences="You will lose all progress. This cannot be undone!"
          onConfirm={onCancel}
          onClose={confirmDiscardChangesModal.onClose}
        />
      </Box>
      {/* Add some margin to offset the extra space being taken up by the new button below. This
      will have the effect of keeping the date visually in the same place as the read-only one */}
      <Box flex="1" marginLeft="40px">
        {children}
      </Box>
      <ButtonGroup spacing={2} variant="ghost">
        <Tooltip label="Delete entry">
          <IconButton
            isDisabled={isSubmitting}
            size="md"
            aria-label="Delete entry"
            icon={<DeleteIcon />}
            onClick={confirmDeleteModal.onOpen}
          />
        </Tooltip>
        <Tooltip label="Save entry">
          <IconButton
            isDisabled={!isDirty}
            isLoading={isSubmitting}
            colorScheme="orange"
            size="md"
            aria-label="Save entry"
            icon={<CheckIcon />}
            type="submit"
          />
        </Tooltip>
        <DangerConfirmModal
          isOpen={confirmDeleteModal.isOpen}
          context="delete this entry"
          consequences="It will be gone forever - this cannot be undone!"
          onConfirm={onDelete}
          onClose={confirmDeleteModal.onClose}
        />
      </ButtonGroup>
    </Flex>
  );
};
