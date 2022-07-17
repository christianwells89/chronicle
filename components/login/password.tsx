import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
} from '@chakra-ui/react';
import { forwardRef, useRef } from 'react';
import { FieldError } from 'react-hook-form';

interface PasswordProps extends InputProps {
  label: string;
  error: FieldError | undefined;
}

export const Password = forwardRef<HTMLInputElement, PasswordProps>(
  ({ label, error, ...props }, ref) => {
    const { isOpen, onToggle } = useDisclosure();
    const inputRef = useRef<HTMLInputElement>(null);
    const mergeRef = useMergeRefs(inputRef, ref);
    const isInvalid = !!error;

    const onClickReveal = () => {
      onToggle();
      if (inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
      }
    };

    return (
      <FormControl isInvalid={isInvalid}>
        <FormLabel htmlFor={props.name}>{label}</FormLabel>
        <InputGroup>
          <Input
            {...props}
            isInvalid={isInvalid}
            ref={mergeRef}
            type={isOpen ? 'text' : 'password'}
          />
          <InputRightElement>
            <IconButton
              variant="link"
              aria-label={isOpen ? 'Mask password' : 'Reveal password'}
              icon={isOpen ? <ViewOffIcon /> : <ViewIcon />}
              onClick={onClickReveal}
            />
          </InputRightElement>
        </InputGroup>
        {!!error && error.message && <FormErrorMessage>{error.message}</FormErrorMessage>}
      </FormControl>
    );
  },
);
