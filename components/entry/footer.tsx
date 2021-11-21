import { CheckIcon, CloseIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Fade,
  HStack,
  IconButton,
  Spacer,
  Tooltip as ChakraTooltip,
  useColorModeValue,
  useDisclosure,
  useToken,
} from '@chakra-ui/react';
import { LocationMarkerIcon, PhotographIcon } from '@heroicons/react/solid';

import { DangerConfirmModal } from '~/components/dangerConfirmModal';

interface EntryFooterProps {
  isEditing: boolean;
  hasChanges: boolean;
  onEdit(): void;
  onCancel(): void;
  onDelete(): void;
  onPhotoAdd(): void;
  onLocationAdd(): void;
}

export const EntryFooter: React.FC<EntryFooterProps> = ({
  isEditing,
  hasChanges,
  onEdit,
  onCancel,
  onDelete,
  onPhotoAdd,
  onLocationAdd,
}) => {
  const editButtonLabel = isEditing ? 'Save entry' : 'Edit entry';
  // The outline buttons have a transparent background which means text can be seen which doesn't
  // look great. So make their backgrounds the same as the overall one. It would also be great if
  // this could use `useToken` but I'm setting custom background colours using `extendTheme` so it
  // isn't in there.
  const bg = useColorModeValue('gray.50', 'gray.900');
  const fontSizeLg = useToken('fontSizes', 'lg');
  const confirmDiscardChangesModal = useDisclosure();
  const confirmDeleteModal = useDisclosure();

  return (
    <>
      <HStack
        direction="row-reverse"
        justifyContent="right"
        spacing={2}
        mt={4}
        position="sticky"
        bottom="25px"
      >
        <Fade in={isEditing} unmountOnExit>
          <HStack>
            <Box borderRadius="full" bg={bg}>
              {/* This is probably better to do in the sidebar if it's displayed there, but it's only
            a placeholder for now anyway */}
              <Tooltip label="Add location">
                <IconButton
                  colorScheme="orange"
                  variant="outline"
                  borderRadius="full"
                  aria-label="Add location"
                  icon={<LocationMarkerIcon height={fontSizeLg} />}
                  onClick={onLocationAdd}
                />
              </Tooltip>
            </Box>
            <Box borderRadius="full" bg={bg}>
              <Tooltip label="Add photo">
                <IconButton
                  colorScheme="orange"
                  variant="outline"
                  borderRadius="full"
                  aria-label="Add photo"
                  icon={<PhotographIcon height={fontSizeLg} />}
                  onClick={onPhotoAdd}
                />
              </Tooltip>
            </Box>
            <Spacer width={16} />
            <Box borderRadius="full" bg={bg}>
              <Tooltip label="Delete entry">
                <IconButton
                  borderRadius="full"
                  variant="outline"
                  aria-label="Delete entry"
                  icon={<DeleteIcon />}
                  onClick={confirmDeleteModal.onOpen}
                />
              </Tooltip>
            </Box>
            <Box borderRadius="full" bg={bg}>
              <Tooltip label="Discard changes">
                <IconButton
                  borderRadius="full"
                  variant="outline"
                  aria-label="Discard changes"
                  icon={<CloseIcon />}
                  onClick={hasChanges ? confirmDiscardChangesModal.onOpen : onCancel}
                />
              </Tooltip>
            </Box>
          </HStack>
        </Fade>
        <Tooltip label={editButtonLabel}>
          <IconButton
            disabled={isEditing && !hasChanges}
            colorScheme="orange"
            borderRadius="full"
            aria-label={editButtonLabel}
            icon={isEditing ? <CheckIcon /> : <EditIcon />}
            onClick={onEdit}
          />
        </Tooltip>
      </HStack>
      <DangerConfirmModal
        isOpen={confirmDiscardChangesModal.isOpen}
        context="discard the changes you've made"
        consequences="You will lose all progress. This cannot be undone!"
        onConfirm={onCancel}
        onClose={confirmDiscardChangesModal.onClose}
      />
      <DangerConfirmModal
        isOpen={confirmDeleteModal.isOpen}
        context="delete this entry"
        consequences="It will be gone forever - this cannot be undone!"
        onConfirm={onDelete}
        onClose={confirmDeleteModal.onClose}
      />
    </>
  );
};

interface TooltipProps {
  label: string;
}

const Tooltip: React.FC<TooltipProps> = ({ label, children }) => (
  <ChakraTooltip hasArrow closeOnMouseDown openDelay={500} label={label} placement="top">
    {children}
  </ChakraTooltip>
);
