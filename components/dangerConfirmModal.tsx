import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

interface DangerConfirmModalProps {
  isOpen: boolean;
  context: string;
  consequences: string;
  onConfirm(): void;
  onClose(): void;
}

export const DangerConfirmModal: React.FC<DangerConfirmModalProps> = ({
  isOpen,
  context,
  consequences,
  onConfirm,
  onClose,
}) => {
  const handleConfirm = () => {
    onClose();
    onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Text mt={4} mb={6}>
            Are you sure you want to {context}?
          </Text>
          <Text>{consequences}</Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleConfirm}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
