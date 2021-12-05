import { Flex, Heading, Input } from '@chakra-ui/react';
import { ChangeEvent } from 'react';

interface EntryTitleProps {
  title: string | null;
  isEditing: boolean;
  onChange(newTitle: string): void;
}

export const EntryTitle: React.VFC<EntryTitleProps> = ({ title, isEditing, onChange }) => {
  if (!isEditing && title === null) return null;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <Flex alignItems="center" h={10} mb={1}>
      {isEditing ? (
        <Input value={title ?? ''} placeholder="Title" onChange={handleChange} />
      ) : (
        <Heading size="sm">{title}</Heading>
      )}
    </Flex>
  );
};
