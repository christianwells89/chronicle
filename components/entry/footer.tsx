import { CheckIcon, CloseIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Fade,
  HStack,
  IconButton,
  Spacer,
  useColorModeValue,
  useDisclosure,
  useToken,
} from '@chakra-ui/react';
import { LocationMarkerIcon, PhotographIcon } from '@heroicons/react/solid';

import { DangerConfirmModal } from '~/components/dangerConfirmModal';
import { Tooltip } from '~/components/tooltip';

interface EntryFooterProps {
  isEditing: boolean;
  hasChanges: boolean;
  onEdit(): void;
  onCancel(): void;
  onDelete(): void;
  onPhotoAdd(): void;
  onLocationAdd(): void;
}

export const EntryFooter: React.VFC<EntryFooterProps> = ({
  isEditing,
  hasChanges,
  onEdit,
  onCancel,
  onDelete,
  onPhotoAdd,
  onLocationAdd,
}) => {
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
            {/* These are probably better to do in the sidebar if they're displayed there, but they're only placeholders for now anyway */}
            <LocationButton bg={bg} fontSize={fontSizeLg} onClick={onLocationAdd} />
            <PhotoButton bg={bg} fontSize={fontSizeLg} onClick={onPhotoAdd} />
            <Spacer width={16} />
            <DeleteButton bg={bg} fontSize={fontSizeLg} onClick={confirmDeleteModal.onOpen} />
            <DiscardChangesButton
              bg={bg}
              fontSize={fontSizeLg}
              onClick={hasChanges ? confirmDiscardChangesModal.onOpen : onCancel}
            />
          </HStack>
        </Fade>
        {isEditing ? <SaveButton hasChanges={hasChanges} /> : <EditButton onClick={onEdit} />}
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

interface ButtonProps {
  bg: string;
  fontSize: string;
  onClick(): void;
}

const LocationButton: React.VFC<ButtonProps> = ({ bg, fontSize, onClick }) => (
  <Box borderRadius="full" bg={bg}>
    <Tooltip label="Add location">
      <IconButton
        colorScheme="orange"
        variant="outline"
        borderRadius="full"
        aria-label="Add location"
        icon={<LocationMarkerIcon height={fontSize} />}
        onClick={onClick}
      />
    </Tooltip>
  </Box>
);

const PhotoButton: React.VFC<ButtonProps> = ({ bg, fontSize, onClick }) => (
  <Box borderRadius="full" bg={bg}>
    <Tooltip label="Add photo">
      <IconButton
        colorScheme="orange"
        variant="outline"
        borderRadius="full"
        aria-label="Add photo"
        icon={<PhotographIcon height={fontSize} />}
        onClick={onClick}
      />
    </Tooltip>
  </Box>
);

const DeleteButton: React.VFC<ButtonProps> = ({ bg, fontSize, onClick }) => (
  <Box borderRadius="full" bg={bg}>
    <Tooltip label="Delete entry">
      <IconButton
        borderRadius="full"
        variant="outline"
        aria-label="Delete entry"
        icon={<DeleteIcon height={fontSize} />}
        onClick={onClick}
      />
    </Tooltip>
  </Box>
);

const DiscardChangesButton: React.VFC<ButtonProps> = ({ bg, fontSize, onClick }) => (
  <Box borderRadius="full" bg={bg}>
    <Tooltip label="Discard changes">
      <IconButton
        borderRadius="full"
        variant="outline"
        aria-label="Discard changes"
        icon={<CloseIcon height={fontSize} />}
        onClick={onClick}
      />
    </Tooltip>
  </Box>
);

const EditButton: React.VFC<{ onClick(): void }> = ({ onClick }) => (
  <Tooltip label="Edit entry">
    <IconButton
      colorScheme="orange"
      borderRadius="full"
      aria-label="Edit entry"
      icon={<EditIcon />}
      onClick={onClick}
      type="button"
    />
  </Tooltip>
);

const SaveButton: React.VFC<{ hasChanges: boolean }> = ({ hasChanges }) => (
  <Tooltip label="Save entry">
    <IconButton
      disabled={!hasChanges}
      colorScheme="orange"
      borderRadius="full"
      aria-label="Save entry"
      icon={<CheckIcon />}
      type="submit"
    />
  </Tooltip>
);
