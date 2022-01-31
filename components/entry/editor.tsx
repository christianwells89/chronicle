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
          class: isEditing ? 'is-editing' : 'read-only',
        },
      },
      onUpdate: ({ editor: currentEditor }) => {
        onChange(currentEditor.getHTML());
      },
    },
    // This is not truly fully controlled because it is not re-setting the content every time it's
    // given new text. Doing that causes errors with the dirty check for some reason
    [/* text, */ isEditing],
  );

  return <EditorContent editor={editor} />;
};
