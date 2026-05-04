import React, { useEffect } from 'react';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { FontSize, LineHeight, TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Code2,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Redo2,
  Strikethrough,
  Type,
  Underline as UnderlineIcon,
  Undo2,
  Video
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

interface ToolbarButtonProps {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const toolbarButtonBase =
  'inline-flex h-10 w-10 items-center justify-center rounded-2xl border text-white/75 transition focus:outline-none focus:ring-2 focus:ring-cyan-400/40 disabled:cursor-not-allowed disabled:opacity-35';

const selectClass =
  'h-10 rounded-2xl border border-white/10 bg-[#061316] px-3 text-xs font-bold text-white/75 outline-none transition hover:border-cyan-400/30 focus:border-cyan-400/40';

const fontFamilies = [
  { label: 'Výchozí', value: '' },
  { label: 'Inter / Sans', value: 'Inter, ui-sans-serif, system-ui, sans-serif' },
  { label: 'Serif', value: 'Georgia, Cambria, "Times New Roman", serif' },
  { label: 'Mono', value: '"JetBrains Mono", "Fira Code", Consolas, monospace' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' }
];

const fontSizes = ['', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px'];
const lineHeights = ['', '1', '1.2', '1.4', '1.6', '1.8', '2'];

const normalizeUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ label, icon, active = false, disabled = false, onClick }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    disabled={disabled}
    onClick={onClick}
    className={`${toolbarButtonBase} ${
      active
        ? 'border-cyan-400/45 bg-cyan-500/15 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.12)]'
        : 'border-white/10 bg-white/[0.04] hover:border-cyan-400/30 hover:bg-cyan-500/10 hover:text-cyan-300'
    }`}
  >
    {icon}
  </button>
);

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'restart-code-block'
          }
        }
      }),
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      LineHeight,
      Underline,
      Highlight.configure({
        multicolor: true
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          rel: 'noreferrer',
          target: '_blank'
        }
      }),
      Image.configure({
        allowBase64: true,
        resize: {
          enabled: true,
          directions: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
          minWidth: 120,
          alwaysPreserveAspectRatio: true
        },
        HTMLAttributes: {
          class: 'restart-rich-image'
        }
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        width: 960,
        height: 540,
        HTMLAttributes: {
          class: 'restart-rich-video'
        }
      }),
      Placeholder.configure({
        placeholder: 'Piš obsah článku. Můžeš vkládat nadpisy, odkazy, obrázky, video, kód, citace i formátovaný text.'
      })
    ],
    content: value || '<p></p>',
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none min-h-[420px] focus:outline-none px-5 py-5 text-white/80 [&_.is-empty:first-child::before]:content-[attr(data-placeholder)] [&_.is-empty:first-child::before]:float-left [&_.is-empty:first-child::before]:h-0 [&_.is-empty:first-child::before]:text-white/25 [&_a]:text-cyan-300 [&_blockquote]:border-cyan-400/30 [&_blockquote]:text-white/65 [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_img]:my-6 [&_img]:rounded-[1.4rem] [&_img]:border [&_img]:border-white/10 [&_iframe]:my-6 [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:rounded-[1.4rem] [&_iframe]:border [&_iframe]:border-white/10 [&_li]:text-white/75 [&_pre]:rounded-[1.4rem] [&_pre]:border [&_pre]:border-cyan-400/15 [&_pre]:bg-black/45 [&_pre]:p-5 [&_code]:text-cyan-100'
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

  const blockValue = editor.isActive('heading', { level: 1 })
    ? 'h1'
    : editor.isActive('heading', { level: 2 })
      ? 'h2'
      : editor.isActive('heading', { level: 3 })
        ? 'h3'
        : editor.isActive('codeBlock')
          ? 'codeBlock'
          : 'paragraph';

  const selectedFontFamily = (editor.getAttributes('textStyle').fontFamily as string | undefined) ?? '';
  const selectedFontSize = (editor.getAttributes('textStyle').fontSize as string | undefined) ?? '';
  const selectedLineHeight = (editor.getAttributes('textStyle').lineHeight as string | undefined) ?? '';
  const selectedColor = (editor.getAttributes('textStyle').color as string | undefined) ?? '#ffffff';
  const selectedHighlight = (editor.getAttributes('highlight').color as string | undefined) ?? '#facc15';

  const setBlock = (block: string) => {
    const chain = editor.chain().focus();
    if (block === 'h1') chain.toggleHeading({ level: 1 }).run();
    if (block === 'h2') chain.toggleHeading({ level: 2 }).run();
    if (block === 'h3') chain.toggleHeading({ level: 3 }).run();
    if (block === 'codeBlock') chain.toggleCodeBlock().run();
    if (block === 'paragraph') chain.setParagraph().run();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Vlož URL odkazu', previousUrl ?? 'https://');

    if (url === null) return;
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: normalizeUrl(url) }).run();
  };

  const setImage = () => {
    const url = window.prompt('Vlož URL obrázku', 'https://');
    if (!url) return;
    const alt = window.prompt('Popis obrázku pro přístupnost', '');
    const title = window.prompt('Titulek obrázku', '');
    editor
      .chain()
      .focus()
      .setImage({ src: normalizeUrl(url), alt: alt ?? '', title: title ?? '' })
      .run();
  };

  const setYoutube = () => {
    const url = window.prompt('Vlož YouTube URL videa', 'https://www.youtube.com/watch?v=');
    if (!url) return;
    editor.chain().focus().setYoutubeVideo({ src: normalizeUrl(url), width: 960, height: 540 }).run();
  };

  const clearFormatting = () => {
    editor
      .chain()
      .focus()
      .unsetAllMarks()
      .clearNodes()
      .unsetColor()
      .unsetFontFamily()
      .unsetFontSize()
      .unsetLineHeight()
      .unsetHighlight()
      .unsetTextAlign()
      .run();
  };

  return (
    <div className="glass-panel rounded-[2.4rem] border-white/10 overflow-hidden">
      <div className="space-y-3 border-b border-white/10 bg-white/[0.03] p-4">
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Typ bloku"
            value={blockValue}
            onChange={(event) => setBlock(event.target.value)}
            className={`${selectClass} min-w-[140px]`}
          >
            <option value="paragraph">Odstavec</option>
            <option value="h1">Nadpis 1</option>
            <option value="h2">Nadpis 2</option>
            <option value="h3">Nadpis 3</option>
            <option value="codeBlock">Blok kódu</option>
          </select>

          <select
            aria-label="Font"
            value={selectedFontFamily}
            onChange={(event) => {
              const nextValue = event.target.value;
              if (nextValue) editor.chain().focus().setFontFamily(nextValue).run();
              else editor.chain().focus().unsetFontFamily().run();
            }}
            className={`${selectClass} min-w-[150px]`}
          >
            {fontFamilies.map((font) => (
              <option key={font.label} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>

          <select
            aria-label="Velikost textu"
            value={selectedFontSize}
            onChange={(event) => {
              const nextValue = event.target.value;
              if (nextValue) editor.chain().focus().setFontSize(nextValue).run();
              else editor.chain().focus().unsetFontSize().run();
            }}
            className={selectClass}
          >
            {fontSizes.map((size) => (
              <option key={size || 'default'} value={size}>
                {size || 'Velikost'}
              </option>
            ))}
          </select>

          <select
            aria-label="Řádkování"
            value={selectedLineHeight}
            onChange={(event) => {
              const nextValue = event.target.value;
              if (nextValue) editor.chain().focus().setLineHeight(nextValue).run();
              else editor.chain().focus().unsetLineHeight().run();
            }}
            className={selectClass}
          >
            {lineHeights.map((height) => (
              <option key={height || 'default'} value={height}>
                {height || 'Řádkování'}
              </option>
            ))}
          </select>

          <label className="inline-flex h-10 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 text-xs font-black uppercase tracking-[0.16em] text-white/60">
            <Type size={15} />
            <input
              type="color"
              value={selectedColor}
              onChange={(event) => editor.chain().focus().setColor(event.target.value).run()}
              className="h-6 w-7 cursor-pointer border-0 bg-transparent p-0"
              aria-label="Barva textu"
            />
          </label>

          <label className="inline-flex h-10 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 text-xs font-black uppercase tracking-[0.16em] text-white/60">
            <Highlighter size={15} />
            <input
              type="color"
              value={selectedHighlight}
              onChange={(event) => editor.chain().focus().setHighlight({ color: event.target.value }).run()}
              className="h-6 w-7 cursor-pointer border-0 bg-transparent p-0"
              aria-label="Zvýraznění textu"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <ToolbarButton label="Odstavec" icon={<Pilcrow size={16} />} active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()} />
          <ToolbarButton label="Nadpis 1" icon={<Heading1 size={16} />} active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} />
          <ToolbarButton label="Nadpis 2" icon={<Heading2 size={16} />} active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
          <ToolbarButton label="Nadpis 3" icon={<Heading3 size={16} />} active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
          <ToolbarButton label="Tučně" icon={<Bold size={16} />} active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
          <ToolbarButton label="Kurzíva" icon={<Italic size={16} />} active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />
          <ToolbarButton label="Podtržení" icon={<UnderlineIcon size={16} />} active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} />
          <ToolbarButton label="Přeškrtnutí" icon={<Strikethrough size={16} />} active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} />
          <ToolbarButton label="Inline kód" icon={<Code size={16} />} active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()} />
          <ToolbarButton label="Blok kódu" icon={<Code2 size={16} />} active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()} />
          <ToolbarButton label="Seznam" icon={<List size={16} />} active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} />
          <ToolbarButton label="Číslovaný seznam" icon={<ListOrdered size={16} />} active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
          <ToolbarButton label="Citace" icon={<Quote size={16} />} active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
          <ToolbarButton label="Oddělovač" icon={<Minus size={16} />} onClick={() => editor.chain().focus().setHorizontalRule().run()} />
          <ToolbarButton label="Zarovnat vlevo" icon={<AlignLeft size={16} />} active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} />
          <ToolbarButton label="Zarovnat na střed" icon={<AlignCenter size={16} />} active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} />
          <ToolbarButton label="Zarovnat vpravo" icon={<AlignRight size={16} />} active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} />
          <ToolbarButton label="Zarovnat do bloku" icon={<AlignJustify size={16} />} active={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()} />
          <ToolbarButton label="Odkaz" icon={<Link2 size={16} />} active={editor.isActive('link')} onClick={setLink} />
          <ToolbarButton label="Obrázek z URL" icon={<ImagePlus size={16} />} onClick={setImage} />
          <ToolbarButton label="YouTube video" icon={<Video size={16} />} onClick={setYoutube} />
          <ToolbarButton label="Vyčistit formát" icon={<Eraser size={16} />} onClick={clearFormatting} />
          <ToolbarButton label="Zpět" icon={<Undo2 size={16} />} disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()} />
          <ToolbarButton label="Znovu" icon={<Redo2 size={16} />} disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()} />
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
