/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// Using Promise.all seems to create concurrency issues and causes timeouts, presumably because all
// of the inserts are tried at once which SQLite clearly can't handle. So forced to do it the dumb
// way with loops.

import { faker } from '@faker-js/faker';
import { Entry, PrismaClient, Tag, User } from '@prisma/client';
import { add, startOfYesterday } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  const user = await createUser(1, 'test');
  await createUser(2, faker.name.firstName()); // extraneous user

  const tags = await createTags(user);

  await createEntries(user, tags);
}

function createUser(id: number, username: string) {
  return prisma.user.upsert({
    where: { id },
    update: {},
    create: {
      id,
      username,
      // password is 'test'
      hash: 'd670d3b3d9fa8267d944010df5dcfa6e74905d0f676ede0f5bc7fa2ff88ee5a7e521cbf4cbd9c59454bbae6b27986df1e010476116e989eacf865d534f9b5212',
      salt: '705cd5113fcbe2ccd6c44ad242fc7ec7',
    },
  });
}

async function createTags(user: User) {
  const tags: Tag[] = [];

  for (let id = 1; id <= 5; id++) {
    const tag = await prisma.tag.upsert({
      where: { id },
      update: {},
      create: {
        id,
        text: faker.word.noun(),
        userId: user.id,
      },
    });
    tags.push(tag);
  }

  return tags;
}

async function createEntries(user: User, tags: Tag[]) {
  // Start from yesterday, so any new entries are guaranteed to be the latest
  let currentDate = startOfYesterday();
  const entries: Entry[] = [];

  for (let id = 1; id <= 100; id++) {
    const entry = await createEntry(id, currentDate, user, tags);
    entries.push(entry);
    currentDate = add(currentDate, { days: -1 });
  }

  return entries;
}

async function createEntry(id: number, day: Date, author: User, allTags: Tag[]) {
  const date = faker.date.between(
    day.toISOString(),
    add(day, { hours: 23, minutes: 59 }).toISOString(),
  );

  const titleLength = faker.datatype.number({ min: 0, max: 4 });
  const title = titleLength === 0 ? null : faker.random.words(titleLength);

  const paragraphCount = faker.datatype.number({ min: 1, max: 5 });
  const text = Array.from({ length: paragraphCount })
    .map(() => `<p>${faker.lorem.paragraph()}</p>`)
    .join('');

  const tags = faker.random.arrayElements(allTags).map((tag) => ({ id: tag.id }));

  const entry = await prisma.entry.upsert({
    where: { id },
    update: {},
    create: {
      id,
      date,
      title,
      text,
      authorId: author.id,
    },
  });

  // Can't include these in the above because you can't set the id while also setting a collection
  // for some reason. So these will change on every seed run, but that isn't so bad
  await prisma.entry.update({ where: { id }, data: { tags: { set: tags } } });

  return entry;
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
