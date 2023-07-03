import { HStack, Tag, useBreakpointValue } from '@chakra-ui/react';

export const ReadOnlyEntryTags: React.FC<{ tags: string[] }> = ({ tags }) => {
  const size = useBreakpointValue({ base: 'md', md: 'sm' });

  return (
    <HStack spacing={1} wrap="wrap">
      {tags.map((tag) => (
        <Tag key={tag} colorScheme="orange" size={size}>
          {tag}
        </Tag>
      ))}
    </HStack>
  );
};
