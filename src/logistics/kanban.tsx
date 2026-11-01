import React from 'react';
import { cn } from '../index';
import { colors, ui } from '@sudobility/design';

export interface KanbanCard {
  id: string;
  title: string;
  content?: React.ReactNode;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  color?: string;
}

export interface KanbanProps {
  /** Columns data */
  columns: KanbanColumn[];
  /** Card click handler */
  onCardClick?: (card: KanbanCard, columnId: string) => void;
  /** Column header click handler */
  onColumnClick?: (column: KanbanColumn) => void;
  /** Additional className */
  className?: string;
}

/**
 * Kanban Component
 *
 * Kanban board with columns and cards.
 * Displays tasks/items organized in vertical columns.
 *
 * @example
 * ```tsx
 * <Kanban
 *   columns={[
 *     { id: 'todo', title: 'To Do', cards: [...] },
 *     { id: 'progress', title: 'In Progress', cards: [...] },
 *     { id: 'done', title: 'Done', cards: [...] }
 *   ]}
 *   onCardClick={(card, col) => openCard(card)}
 * />
 * ```
 */
export const Kanban: React.FC<KanbanProps> = ({
  columns,
  onCardClick,
  onColumnClick,
  className,
}) => {
  return (
    <div className={cn('flex gap-4 overflow-x-auto pb-4', className)}>
      {columns.map(column => (
        <div
          key={column.id}
          className={cn(
            'flex-shrink-0 w-80 rounded-lg p-4',
            ui.background.subtle
          )}
        >
          {/* Column header */}
          <div
            className={cn(
              'flex items-center justify-between mb-4 cursor-pointer',
              onColumnClick && 'hover:opacity-80 transition-opacity'
            )}
            onClick={() => onColumnClick?.(column)}
          >
            <h3
              className={cn(
                'font-semibold flex items-center gap-2',
                ui.text.strong
              )}
            >
              {column.color && (
                <div
                  className='w-3 h-3 rounded-full'
                  style={{ backgroundColor: column.color }}
                />
              )}
              {column.title}
            </h3>
            <span className={cn('text-sm', ui.text.muted)}>
              {column.cards.length}
            </span>
          </div>

          {/* Cards */}
          <div className='space-y-3'>
            {column.cards.map(card => (
              <div
                key={card.id}
                className={cn(
                  'rounded-lg p-3',
                  ui.shadow.sm,
                  'border',
                  colors.component.card.default.base,
                  colors.component.card.default.dark,
                  onCardClick &&
                    'cursor-pointer hover:shadow-md transition-shadow'
                )}
                onClick={() => onCardClick?.(card, column.id)}
              >
                <h4
                  className={cn('font-medium text-sm mb-1', ui.text.emphasis)}
                >
                  {card.title}
                </h4>
                {card.content && (
                  <div className={cn('text-sm', ui.text.muted)}>
                    {card.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
