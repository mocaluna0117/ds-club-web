import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import type { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';

export type SlashCommandItem = {
  icon: string;
  title: string;
  description: string;
  command: (props: { editor: any; range: any }) => void;
};

type Props = SuggestionProps<SlashCommandItem>;
type Ref = { onKeyDown: (props: SuggestionKeyDownProps) => boolean };

export const SlashCommandMenu = forwardRef<Ref, Props>((props, ref) => {
  const [selected, setSelected] = useState(0);

  useEffect(() => setSelected(0), [props.items]);

  const run = (index: number) => {
    const item = props.items[index];
    if (item) props.command(item);
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        setSelected((i) => (i - 1 + props.items.length) % props.items.length);
        return true;
      }
      if (event.key === 'ArrowDown') {
        setSelected((i) => (i + 1) % props.items.length);
        return true;
      }
      if (event.key === 'Enter') {
        run(selected);
        return true;
      }
      return false;
    },
  }));

  if (props.items.length === 0) return null;

  return (
    <div className="slash-menu">
      {props.items.map((item, i) => (
        <button
          key={item.title}
          className={`slash-menu-item${i === selected ? ' active' : ''}`}
          onMouseEnter={() => setSelected(i)}
          onClick={() => run(i)}
        >
          <span className="slash-menu-icon">{item.icon}</span>
          <div>
            <div className="slash-menu-title">{item.title}</div>
            <div className="slash-menu-desc">{item.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
});

SlashCommandMenu.displayName = 'SlashCommandMenu';
