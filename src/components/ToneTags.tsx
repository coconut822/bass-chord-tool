import { IntervalRole, Tone } from '../lib/musicTheory';

interface ToneTagsProps {
  items: string[] | IntervalRole[] | Tone[];
  type?: 'note' | 'role';
}

export function ToneTags({ items, type = 'note' }: ToneTagsProps) {
  return (
    <span className="tag-list">
      {items.map((item, index) => {
        const value = typeof item === 'string' ? item : type === 'role' ? item.role : item.note;
        const roleClass = type === 'role' ? ` role-${value.replace('#', 'sharp').replace('b', 'flat')}` : '';

        return (
          <span className={`music-tag ${type === 'role' ? 'role-tag' : 'note-tag'}${roleClass}`} key={`${value}-${index}`}>
            {value}
          </span>
        );
      })}
    </span>
  );
}
