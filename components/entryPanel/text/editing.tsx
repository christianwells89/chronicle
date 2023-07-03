import { Box, useColorModeValue } from '@chakra-ui/react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface EntryEditorProps {
  text: string;
  onChange(newText: string): void;
}

export const EditingEntryText: React.VFC<EntryEditorProps> = ({ text, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: text,
    editable: true,
    autofocus: 'end',
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  return (
    // Similar to the read only entry, but this is here because we want to have the outline and
    // styles mimicking the input be on the outside and not affected by the scroll.
    <Box
      flex="1"
      overflowY="auto"
      mt={0}
      py={2}
      px={4}
      minHeight={36}
      border="1px solid"
      borderRadius="md"
      borderColor={useColorModeValue('gray.200', 'whiteAlpha.300')}
      _focusWithin={{
        borderColor: useColorModeValue('#3182ce', '#63b3ed'),
        boxShadow: `0 0 0 1px ${useColorModeValue('#3182ce', '#63b3ed')}`,
      }}
    >
      <EditorContent editor={editor} />
    </Box>
  );
};
