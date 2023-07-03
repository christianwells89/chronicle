import { Card, Heading, HStack, SkeletonText, Tag, Text, VStack } from '@chakra-ui/react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/router';

import { SerializedEntryWithTags } from '~/pages/api/entries';

interface EntryCardProps {
  entry: SerializedEntryWithTags;
}

export const EntryCard: React.FC<EntryCardProps> = ({ entry }) => {
  const router = useRouter();
  const isSelected = router.query.entry === entry.uuid;

  return (
    <EntryCardContainer uuid={entry.uuid} isSelected={isSelected}>
      <Date rawDate={entry.date} />
      <VStack flex="1" alignItems="flex-start">
        <Body title={entry.title} text={entry.text} />
        <Footer tags={entry.tags} />
      </VStack>
    </EntryCardContainer>
  );
};

interface EntryCardContainerProps {
  uuid: string;
  isSelected?: boolean;
  children: React.ReactNode;
}

export const EntryCardContainer: React.FC<EntryCardContainerProps> = ({
  uuid,
  isSelected = false,
  children,
}) => (
  <Card p={2} direction="row" variant={isSelected ? 'filled' : 'outline'} minH={110} id={uuid}>
    {children}
  </Card>
);

const Date: React.FC<{ rawDate: string }> = ({ rawDate }) => {
  const date = parseISO(rawDate);

  return (
    <VStack
      spacing={0}
      color="gray.400"
      textTransform="uppercase"
      fontSize="xs"
      fontWeight="bold"
      textAlign="center"
      marginRight={4}
      alignSelf="center"
    >
      <Text>{format(date, 'EEE')}</Text>
      <Text fontSize="4xl" lineHeight="none">
        {format(date, 'dd')}
      </Text>
      <Text>{format(date, 'LLL')}</Text>
      <Text>{format(date, 'y')}</Text>
    </VStack>
  );
};

interface BodyProps {
  title: string | null;
  text: string;
}

const Body: React.FC<BodyProps> = ({ title, text }) => {
  // use an uneditable tiptap editor to display the text the same way it is in the entry page
  const editor = useEditor(
    {
      extensions: [StarterKit],
      content: text,
      editable: false,
      editorProps: {
        attributes: {
          class: 'preview',
        },
      },
    },
    [text],
  );
  // It will tend to be null on the first few renders, so to avoid jank handle it with this in
  // conjunction with a skeleton loader
  const isLoaded = !!editor;

  return (
    <VStack flex={1} justifyContent="center">
      <SkeletonText isLoaded={isLoaded} noOfLines={3} alignSelf="stretch">
        <Heading size="sm" noOfLines={1}>
          {title}
        </Heading>
        {/* TODO: doesn't actually display right in Safari - need to play with overflow/max-height */}
        <Text as="div" fontSize="sm" noOfLines={title === null ? 3 : 2}>
          <EditorContent editor={editor} />
        </Text>
      </SkeletonText>
    </VStack>
  );
};

const Footer: React.FC<{ tags: string[] }> = ({ tags }) => (
  <HStack spacing={1}>
    {tags.map((tag) => (
      <Tag key={tag} colorScheme="orange" size="sm">
        {tag}
      </Tag>
    ))}
  </HStack>
);
