import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface EntryEditorProps {
  text: string;
  isEditable: boolean;
}

export const EntryEditor = ({ text, isEditable }: EntryEditorProps) => {
  const editor = useEditor({ extensions: [StarterKit], content: text, editable: isEditable });

  return <EditorContent editor={editor} />;
};
