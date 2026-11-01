import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../index';
import { colors, ui } from '@sudobility/design';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar?: string;
}

export interface UserMentionProps {
  /** Available users to mention */
  users: User[];
  /** Mention handler */
  onMention?: (user: User) => void;
  /** Input value */
  value: string;
  /** Value change handler */
  onChange: (value: string) => void;
  /** Placeholder */
  placeholder?: string;
  /** Additional className */
  className?: string;
  /** Optional tracking callback */
  onTrack?: (action: string) => void;
}

/**
 * UserMention Component
 *
 * Input with @mention autocomplete functionality.
 * Shows dropdown when user types @ symbol.
 *
 * @example
 * ```tsx
 * <UserMention
 *   users={[
 *     { id: '1', name: 'John Doe', username: 'johndoe', avatar: '/avatar1.jpg' },
 *     { id: '2', name: 'Jane Smith', username: 'janesmith' }
 *   ]}
 *   value={text}
 *   onChange={setText}
 *   onMention={(user) => console.log('Mentioned:', user)}
 * />
 * ```
 */
export const UserMention: React.FC<UserMentionProps> = ({
  users,
  onMention,
  value,
  onChange,
  placeholder = 'Type @ to mention someone...',
  className,
  onTrack,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentionStart, setMentionStart] = useState(-1);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const text = value;
    const cursorPos = inputRef.current?.selectionStart || 0;

    // Find @ symbol before cursor
    let atPos = -1;
    for (let i = cursorPos - 1; i >= 0; i--) {
      if (text[i] === '@') {
        atPos = i;
        break;
      }
      if (text[i] === ' ' || text[i] === '\n') {
        break;
      }
    }

    if (atPos !== -1) {
      const query = text.slice(atPos + 1, cursorPos).toLowerCase();
      const filtered = users.filter(
        user =>
          user.name.toLowerCase().includes(query) ||
          user.username.toLowerCase().includes(query)
      );

      if (filtered.length > 0) {
        setFilteredUsers(filtered);
        setShowSuggestions(true);
        setMentionStart(atPos);
        setSelectedIndex(0);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  }, [value, users]);

  const insertMention = (user: User) => {
    onTrack?.('mention_select');
    const before = value.slice(0, mentionStart);
    const after = value.slice(inputRef.current?.selectionStart || value.length);
    const newValue = `${before}@${user.username} ${after}`;

    onChange(newValue);
    setShowSuggestions(false);

    if (onMention) {
      onMention(user);
    }

    // Focus back on input
    setTimeout(() => {
      inputRef.current?.focus();
      const newPos = mentionStart + user.username.length + 2;
      inputRef.current?.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredUsers.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(
        prev => (prev - 1 + filteredUsers.length) % filteredUsers.length
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      insertMention(filteredUsers[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <textarea
        ref={inputRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          'w-full px-4 py-3 border resize-none focus:outline-none',
          colors.component.input.default.base,
          colors.component.input.default.dark,
          colors.component.input.default.focus,
          ui.border.radius
        )}
        rows={4}
      />

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div
          className={cn(
            'absolute z-10 mt-1 w-full border max-h-60 overflow-y-auto',
            ui.background.surface,
            ui.border.default,
            ui.border.radius,
            ui.shadow.lg
          )}
        >
          {filteredUsers.map((user, index) => (
            <button
              key={user.id}
              onClick={() => insertMention(user)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                index === selectedIndex ? 'bg-primary/10' : 'hover:bg-muted'
              )}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className='w-8 h-8 rounded-full'
                />
              ) : (
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-foreground font-semibold text-sm',
                    ui.background.muted
                  )}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className='flex-1 min-w-0'>
                <p className='font-medium text-foreground truncate'>
                  {user.name}
                </p>
                <p className='text-sm text-muted-foreground truncate'>
                  @{user.username}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
