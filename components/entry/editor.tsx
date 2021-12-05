import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface EntryEditorProps {
  text: string;
  isEditing: boolean;
  onChange(newText: string): void;
}

export const EntryEditor: React.VFC<EntryEditorProps> = ({ text, isEditing, onChange }) => {
  const editor = useEditor(
    {
      extensions: [StarterKit],
      content: text,
      editable: isEditing,
      autofocus: isEditing ? 'end' : false,
      editorProps: {
        attributes: {
          class: isEditing ? 'is-editing' : '',
        },
      },
      onUpdate: ({ editor: currentEditor }) => {
        onChange(currentEditor.getHTML());
      },
    },
    [text, isEditing],
  );

  return <EditorContent editor={editor} />;
};
