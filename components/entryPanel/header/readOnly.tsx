import { EditIcon } from '@chakra-ui/icons';
import { Box, CloseButton, Flex, IconButton, Tooltip } from '@chakra-ui/react';

interface ReadOnlyHeaderProps {
  children: React.ReactNode;
  onEdit(): void;
  onClose(): void;
}

export const ReadOnlyEntryPanelHeader: React.FC<ReadOnlyHeaderProps> = ({
  children,
  onEdit,
  onClose,
}) => (
  <Flex alignItems="center">
    <Box ml={-2}>
      <CloseButton onClick={onClose} />
    </Box>
    <Box flex="1">{children}</Box>
    <Box>
      <Tooltip label="Edit entry">
        <IconButton
          colorScheme="orange"
          variant="ghost"
          size="md"
          aria-label="Edit entry"
          icon={<EditIcon />}
          onClick={onEdit}
          type="button"
        />
      </Tooltip>
    </Box>
  </Flex>
);
