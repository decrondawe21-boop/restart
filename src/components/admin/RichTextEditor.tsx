import React, { useEffect } from 'react';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const actionButtonClass =
  'inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/75 transition hover:border-cyan-400/30 hover:bg-cyan-500/10 hover:text-cyan-300';

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noreferrer',
          target: '_blank'
        }
      }),
      Image
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none min-h-[320px] focus:outline-none px-5 py-4 text-white/80 [&_a]:text-cyan-300 [&_blockquote]:border-cyan-400/30 [&_blockquote]:text-white/65 [&_h2]:text-white [&_h3]:text-white [&_li]:text-white/75'
      }
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    }
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() === value) return;
    editor.commands.setContent(value || '<p></p>', { emitUpdate: false });
  }, [editor, value]);

  if (!editor) {
    return <div className="glass-panel rounded-[2rem] border-white/10 p-6 text-white/50">Načítám editor…</div>;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Vlož URL odkazu', previousUrl ?? 'https://');

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const setImage = () => {
    const url = window.prompt('Vlož URL obrázku', 'https://');
    if (!url) return;
    editor.chain().focus().setImage({ src: url, alt: 'Obsahový obrázek' }).run();
  };

  return (
    <div className="glass-panel rounded-[2.4rem] border-white/10 overflow-hidden">
      <div className="flex flex-wrap gap-2 border-b border-white/10 bg-white/[0.03] p-4">
        <button type="button" className={actionButtonClass} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </button>
        <button type="button" className={actionButtonClass} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </button>
        <button type="button" className={actionButtonClass} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={16} />
        </button>
        <button type="button" className={actionButtonClass} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={16} />
        </button>
        <button type="button" className={actionButtonClass} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </button>
        <button type="button" className={actionButtonClass} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} />
        </button>
        <button type="button" className={actionButtonClass} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={16} />
        </button>
        <button type="button" className={actionButtonClass} onClick={setLink}>
          <Link2 size={16} />
        </button>
        <button type="button" className={actionButtonClass} onClick={setImage}>
          <ImagePlus size={16} />
        </button>
        <button type="button" className={actionButtonClass} onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 size={16} />
        </button>
        <button type="button" className={actionButtonClass} onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 size={16} />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
