import { CalendarIcon } from '@chakra-ui/icons';
import {
  Box,
  IconButton,
  Flex,
  HStack,
  StackDivider,
  Text,
  useBoolean,
  useColorModeValue,
  useOutsideClick,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import React, { useRef, useState } from 'react';
import DatePicker from 'react-datepicker';

import { Tooltip } from '~/components/tooltip';

import 'react-datepicker/dist/react-datepicker.css';
import styles from './date.module.scss';

interface EntryDateProps {
  date: Date;
  isEditing: boolean;
  onChange(date: Date): void;
}

export const EntryDate: React.VFC<EntryDateProps> = ({ date: inputDate, isEditing, onChange }) => {
  // Until the form is properly set up to make this  fully controlled, just keep the state locally
  // so that selections can be reflected
  const [date, setDate] = useState(inputDate);
  const [isOpen, { off, toggle: toggleIsOpen }] = useBoolean(false);
  const datepickerRef = useRef<HTMLDivElement>(null);
  const datepickerTheme = useColorModeValue('light-theme', 'dark-theme');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    toggleIsOpen();
  };
  const handleChange = (newDate: Date) => {
    setDate(newDate);
    onChange(newDate);
  };
  useOutsideClick({
    ref: datepickerRef,
    handler: () => {
      if (isOpen) off();
    },
  });

  return (
    <HStack
      className={styles[datepickerTheme]}
      spacing={2}
      position="relative"
      divider={<StackDivider />}
    >
      <Flex alignItems="center" lineHeight="none" direction="column">
        <Text fontSize="xs">{format(date, 'EEE')}</Text>
        <Text fontSize="3xl">{format(date, 'd')}</Text>
      </Flex>
      <Flex alignItems="center" fontSize="lg" lineHeight="none" direction="column">
        <Text>{format(date, 'MMM Y')}</Text>
        <Text>{format(date, 'h:mm a')}</Text>
      </Flex>
      {isEditing && (
        <Box className={datepickerTheme} ref={datepickerRef}>
          <Tooltip label="Edit date">
            <IconButton
              colorScheme="orange"
              size="sm"
              borderRadius="full"
              aria-label="Edit date"
              icon={<CalendarIcon />}
              onClick={handleClick}
            />
          </Tooltip>
          {isOpen && (
            <Box className={styles.datePickerContainer} position="absolute" top="100%" left="0">
              <DatePicker selected={date} onChange={handleChange} inline showTimeInput />
            </Box>
          )}
        </Box>
      )}
    </HStack>
  );
};
