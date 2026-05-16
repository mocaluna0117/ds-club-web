import { Extension } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';
import tippy, { type Instance } from 'tippy.js';
import { SlashCommandMenu, type SlashCommandItem } from './SlashCommandMenu';

const COMMANDS: SlashCommandItem[] = [
  {
    icon: 'H1',
    title: '見出し 1',
    description: '大きな見出し',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run(),
  },
  {
    icon: 'H2',
    title: '見出し 2',
    description: '中見出し',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run(),
  },
  {
    icon: 'H3',
    title: '見出し 3',
    description: '小見出し',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run(),
  },
  {
    icon: '•',
    title: '箇条書き',
    description: '順番のないリスト',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    icon: '1.',
    title: '番号付きリスト',
    description: '番号付きリスト',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    icon: '❝',
    title: '引用',
    description: 'ブロック引用',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setBlockquote().run(),
  },
  {
    icon: '</>',
    title: 'コードブロック',
    description: 'コードを記述',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setCodeBlock().run(),
  },
  {
    icon: '∑',
    title: '数式',
    description: 'LaTeX 数式（$$...$$）',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).insertContent('$$f(x) = x^2$$').run(),
  },
  {
    icon: '🖼',
    title: '画像',
    description: 'URL から画像を挿入',
    command: ({ editor, range }) => {
      const url = window.prompt('画像 URL を入力してください');
      if (url) editor.chain().focus().deleteRange(range).setImage({ src: url }).run();
    },
  },
  {
    icon: '—',
    title: '区切り線',
    description: '水平線',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
];

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addProseMirrorPlugins() {
    return [
      Suggestion<SlashCommandItem>({
        editor: this.editor,
        char: '/',
        command: ({ editor, range, props }) => props.command({ editor, range }),
        items: ({ query }) =>
          COMMANDS.filter(
            (c) =>
              c.title.toLowerCase().includes(query.toLowerCase()) ||
              c.description.toLowerCase().includes(query.toLowerCase()),
          ),
        render: () => {
          let renderer: ReactRenderer;
          let popup: Instance[];

          return {
            onStart: (props) => {
              renderer = new ReactRenderer(SlashCommandMenu, {
                props,
                editor: props.editor,
              });
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
      }),
    ];
  },
});
