import { Button, Divider, Flex, Text, VStack } from '@chakra-ui/react';
import { format, getYear, isSameYear, parseISO } from 'date-fns';
import { Fragment } from 'react';

import { Month } from '~/pages/api/entries/months';

interface MonthsProps {
  months: Month[];
  selectedMonth: Month | null;
  onMonthChange(month: Month, scrollTo: boolean): void;
}

export const Months: React.FC<MonthsProps> = ({ months, selectedMonth, onMonthChange }) => (
  <VStack width="3xs" alignItems="stretch" height="fit-content" flex="0">
    {months.map((month, i) => {
      const previous = i === 0 ? null : months[i - 1];

      return (
        <Fragment key={month}>
          <MaybeYearDivider current={month} previous={previous} />
          <MonthItem month={month} selectedMonth={selectedMonth} onMonthChange={onMonthChange} />
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
  selectedMonth: Month | null;
  onMonthChange(month: Month, scrollTo: boolean): void;
}

const MonthItem: React.FC<MonthItemProps> = ({ month, selectedMonth, onMonthChange }) => {
  const monthDate = parseISO(month);
  const isActive = selectedMonth === month;
  const variant = isActive ? 'solid' : 'ghost';
  const colorScheme = isActive ? 'orange' : 'gray';

  const onClick = () => {
    onMonthChange(month, true);
  };

  return (
    <Button size="sm" variant={variant} colorScheme={colorScheme} onClick={onClick}>
      {format(monthDate, 'LLLL')}
    </Button>
  );
};
