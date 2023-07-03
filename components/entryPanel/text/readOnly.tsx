import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

export const ReadOnlyEntryText: React.FC<{ text: string }> = ({ text }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: text,
    editable: false,
  });

  useEffect(() => {
    editor?.commands.setContent(text);
  }, [editor, text]);

  return <EditorContent editor={editor} />;
};
