import { CalendarIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  useBoolean,
  useBreakpointValue,
  useColorModeValue,
  useOutsideClick,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { useRef } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import styles from './date.module.scss';

// TODO: Replace the current date-picker with a more chakra-like one, using the below repos as
// inspiration.
// https://github.com/aboveyunhai/chakra-dayzed-datepicker
// https://github.com/uselessdev/datepicker

interface EditingEntryDateProps {
  date: Date;
  onChange(date: Date): void;
}

export const EditingEntryDate: React.FC<EditingEntryDateProps> = ({ date, onChange }) => {
  const [isOpen, { off, toggle: toggleIsOpen }] = useBoolean(false);
  const datepickerRef = useRef<HTMLDivElement>(null);
  const datepickerTheme = useColorModeValue('light-theme', 'dark-theme');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    toggleIsOpen();
  };
  const dateFormat = useBreakpointValue({ base: 'LLL d, yyyy', md: 'E, LLL d, yyyy h:mm b' });
  // TODO: just use PopOver
  useOutsideClick({
    ref: datepickerRef,
    handler: () => {
      if (isOpen) off();
    },
  });

  return (
    <Flex className={styles[datepickerTheme]} position="relative" ref={datepickerRef}>
      <Button
        mx="auto"
        size="md"
        variant="outline"
        leftIcon={<CalendarIcon />}
        onClick={handleClick}
      >
        {format(date, dateFormat ?? '')}
      </Button>
      {isOpen && (
        <Box
          className={styles.datePickerContainer}
          position="absolute"
          top="100%"
          left="22%"
          zIndex="1"
        >
          <DatePicker selected={date} onChange={onChange} inline showTimeInput />
        </Box>
      )}
    </Flex>
  );
};
