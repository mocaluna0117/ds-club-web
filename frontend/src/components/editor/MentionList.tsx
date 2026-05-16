import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import type { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';

export type MentionItem = { id: number; label: string };

type Props = SuggestionProps<MentionItem>;
type Ref = { onKeyDown: (props: SuggestionKeyDownProps) => boolean };

export const MentionList = forwardRef<Ref, Props>((props, ref) => {
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
          key={item.id}
          className={`slash-menu-item${i === selected ? ' active' : ''}`}
          onMouseEnter={() => setSelected(i)}
          onClick={() => run(i)}
        >
          <span className="slash-menu-icon mention-icon">@</span>
          <div className="slash-menu-title">{item.label}</div>
        </button>
      ))}
    </div>
  );
});

MentionList.displayName = 'MentionList';
