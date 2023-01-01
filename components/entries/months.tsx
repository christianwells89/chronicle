import { Button, Divider, Flex, Text, VStack } from '@chakra-ui/react';
import { format, getYear, isSameYear, parseISO } from 'date-fns';
import { Fragment } from 'react';

import { Month } from '~/pages/api/entries/months';

interface MonthsProps {
  months: Month[];
  selectedMonth: Month | undefined;
  setMonth(month: Month): void;
}

export const Months: React.FC<MonthsProps> = ({ months, selectedMonth, setMonth }) => (
  <VStack
    width="3xs"
    alignItems="stretch"
    paddingX="4"
    height="fit-content"
    position="sticky"
    top="4"
  >
    {months.map((month, i) => {
      const previous = i === 0 ? null : months[i - 1];

      return (
        <Fragment key={month}>
          <MaybeYearDivider current={month} previous={previous} />
          <MonthItem month={month} selectedMonth={selectedMonth} onClick={setMonth} />
        </Fragment>
      );
    })}
  </VStack>
);

interface YearDividerProps {
  previous: Month | null;
  current: Month;
}

const MaybeYearDivider: React.FC<YearDividerProps> = ({ previous, current }) => {
  const currentMonthDate = parseISO(current);

  if (previous === null || !isSameYear(currentMonthDate, parseISO(previous))) {
    return (
      <Flex align="center">
        <Divider />
        <Text paddingX="2" fontSize="xs">
          {getYear(currentMonthDate)}
        </Text>
        <Divider />
      </Flex>
    );
  }

  return null;
};

interface MonthItemProps {
  month: Month;
  selectedMonth: Month | undefined;
  onClick(month: Month): void;
}

const MonthItem: React.FC<MonthItemProps> = ({ month, selectedMonth, onClick }) => {
  const monthDate = parseISO(month);
  const handleClick = () => onClick(month);
  const variant = month === selectedMonth ? 'solid' : 'ghost';
  const colorScheme = month === selectedMonth ? 'orange' : 'gray';

  return (
    <Button size="sm" variant={variant} colorScheme={colorScheme} onClick={handleClick}>
      {format(monthDate, 'LLLL')}
    </Button>
  );
};
