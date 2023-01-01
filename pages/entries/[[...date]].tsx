import { Container, Flex } from '@chakra-ui/react';
import { format, parseISO } from 'date-fns';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Suspense, useCallback, useEffect } from 'react';

import { EntriesByDate } from '~/components/entries/byDate';
import { Months } from '~/components/entries/months';
import { prisma } from '~/lib/client';
import { protectedSsr } from '~/lib/session';
import type { Month } from '~/pages/api/entries/months';

// This route has a catch-all optional route of [[...date]] because next doesn't yet support a
// single optional route like [[date]]. So we need to do some validation to make sure it's a real
// date, which we'd probably need to be doing anyway

interface EntriesPageProps {
  months: Month[];
}

const EntriesPage: NextPage<EntriesPageProps> = ({ months }) => {
  const [date, setDate] = useDate(months);

  return (
    <Container maxW="container.xl">
      <Flex>
        {/* TODO: make this a "date" component that can be either months or a calendar */}
        <Months months={months} selectedMonth={date} setMonth={setDate} />
        <Suspense fallback={<div>Loading...</div>}>
          {/* Ideally an undefined date would trigger suspense, but there doesn't seem to be a good
          way of doing that manually. It should only be that for a short time anyway */}
          {date ? <EntriesByDate date={date} /> : null}
        </Suspense>
      </Flex>
    </Container>
  );
};

export default EntriesPage;

export const getServerSideProps = protectedSsr<EntriesPageProps>(async (context) => {
  const result = await prisma.entry.findMany({
    where: { authorId: { equals: context.req.session.user.id } },
    orderBy: { date: 'desc' },
    select: { date: true },
  });

  const months = result.reduce((acc, row) => {
    const month = format(row.date, 'yyyy-MM') as Month;
    acc.add(month);
    return acc;
  }, new Set<Month>());

  return { props: { months: Array.from(months) } };
});

const useDate = (months: Month[]): [Month | undefined, (month: Month) => void] => {
  const router = useRouter();
  const date = getDateFromQuery(router.query.date);
  const setDate = useCallback(
    // TODO: also allow day
    (newDate: Month) => {
      router.push(`/entries/${newDate}`, undefined, { shallow: true });
    },
    [router],
  );

  useEffect(() => {
    if (!date && router.isReady) {
      const mostRecentMonth = months.length > 0 ? parseISO(months[0]) : new Date();
      const currentMonth = format(mostRecentMonth, 'yyyy-MM') as Month;
      setDate(currentMonth);
    }
  }, [date, router.isReady, setDate, months]);

  return [date, setDate];
};

/*
 * We can't trust that Next will give us the query param as a single string or an array
 */
function getDateFromQuery(query: string | string[] | undefined): Month | undefined {
  if (!query) {
    return undefined;
  }
  if (typeof query === 'string') {
    return query as Month;
  }
  return query[0] as Month;
}
