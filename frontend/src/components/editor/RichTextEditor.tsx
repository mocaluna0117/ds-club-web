import { useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { useEditor, EditorContent, ReactRenderer } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Mark, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Mention from '@tiptap/extension-mention';
import Mathematics from '@tiptap/extension-mathematics';
import Placeholder from '@tiptap/extension-placeholder';
import tippy, { type Instance } from 'tippy.js';
import 'katex/dist/katex.min.css';
import 'tippy.js/dist/tippy.css';
import './editor.css';
import { SlashCommand } from './SlashCommand';
import { MentionList, type MentionItem } from './MentionList';
import { GET_MEMBERS } from '../../graphql/queries';

const FONT_SIZES = [
  { label: '小', value: '13px' },
  { label: '標準', value: '' },
  { label: '大', value: '20px' },
  { label: '特大', value: '26px' },
];

const FontSize = Mark.create({
  name: 'fontSize',
  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: (el) => (el as HTMLElement).style.fontSize || null,
        renderHTML: (attrs) => attrs.size ? { style: `font-size: ${attrs.size}` } : {},
      },
    };
  },
  parseHTML() {
    return [{ tag: 'span[style*="font-size"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0];
  },
});

type Props = {
  content: string;
  onChange: (html: string) => void;
};

export function RichTextEditor({ content, onChange }: Props) {
  const { data: membersData } = useQuery(GET_MEMBERS);
  const membersRef = useRef<MentionItem[]>([]);

  useEffect(() => {
    if (membersData?.members) {
      membersRef.current = membersData.members.map((m) => ({ id: m.id, label: m.name }));
    }
  }, [membersData]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      FontSize,
      Image.configure({ inline: false }),
      Mathematics,
      Placeholder.configure({ placeholder: '/ でコマンドを呼び出す、または自由に書き始めてください...' }),
      SlashCommand,
      Mention.configure({
        HTMLAttributes: { class: 'mention' },
        suggestion: {
          allowedPrefixes: null,
          items: ({ query }) =>
            membersRef.current
              .filter((m) => m.label.toLowerCase().includes(query.toLowerCase()))
              .slice(0, 8),
          render: () => {
            let renderer: ReactRenderer;
            let popup: Instance[];
            return {
              onStart: (props) => {
                renderer = new ReactRenderer(MentionList, { props, editor: props.editor });
                if (!props.clientRect) return;
                popup = tippy('body', {
                  getReferenceClientRect: props.clientRect as () => DOMRect,
                  appendTo: () => document.body,
                  content: renderer.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: 'manual',
                  placement: 'bottom-start',
                });
              },
              onUpdate: (props) => {
                renderer.updateProps(props);
                if (!props.clientRect) return;
                popup[0]?.setProps({ getReferenceClientRect: props.clientRect as () => DOMRect });
              },
              onKeyDown: (props) => {
                if (props.event.key === 'Escape') {
                  popup[0]?.hide();
                  return true;
                }
                return (renderer.ref as any)?.onKeyDown(props) ?? false;
              },
              onExit: () => {
                popup[0]?.destroy();
                renderer.destroy();
              },
            };
          },
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== content) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div>
      <BubbleMenu editor={editor}>
        <div className="bubble-menu">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''}>
            <strong>B</strong>
          </button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''}>
            <em>I</em>
          </button>
          <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'active' : ''}>
            <s>S</s>
          </button>
          <button onClick={() => editor.chain().focus().toggleCode().run()} className={editor.isActive('code') ? 'active' : ''}>
            {'<>'}
          </button>
          <div className="bubble-separator" />
          <select
            className="bubble-font-size"
            value={editor.getAttributes('fontSize').size ?? ''}
            onChange={(e) => {
              const size = e.target.value;
              if (size) {
                (editor.chain().focus() as any).setMark('fontSize', { size }).run();
              } else {
                (editor.chain().focus() as any).unsetMark('fontSize').run();
              }
            }}
          >
            {FONT_SIZES.map((s) => (
              <option key={s.label} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </BubbleMenu>

      <EditorContent editor={editor} />
    </div>
  );
}
