import React, { useState } from 'react';
import { cn } from '../index';
import { colors, ui } from '@sudobility/design';

export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  replies?: Comment[];
}

export interface CommentThreadProps {
  /** Comments data */
  comments: Comment[];
  /** Reply handler */
  onReply?: (commentId: string, content: string) => void;
  /** Delete handler */
  onDelete?: (commentId: string) => void;
  /** Max nesting level */
  maxDepth?: number;
  /** Additional className */
  className?: string;
}

/**
 * CommentThread Component
 *
 * Nested comment thread with replies.
 * Supports avatars, timestamps, and actions.
 *
 * @example
 * ```tsx
 * <CommentThread
 *   comments={[
 *     {
 *       id: '1',
 *       author: 'John Doe',
 *       content: 'Great article!',
 *       timestamp: '2 hours ago',
 *       replies: [...]
 *     }
 *   ]}
 *   onReply={(id, content) => handleReply(id, content)}
 *   maxDepth={3}
 * />
 * ```
 */
export const CommentThread: React.FC<CommentThreadProps> = ({
  comments,
  onReply,
  onDelete,
  maxDepth = 5,
  className,
}) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitReply = (commentId: string) => {
    if (onReply && replyContent.trim()) {
      onReply(commentId, replyContent);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const CommentItem = ({
    comment,
    depth = 0,
  }: {
    comment: Comment;
    depth?: number;
  }) => {
    const canNest = depth < maxDepth;

    return (
      <div className={cn('flex gap-3', depth > 0 && 'ml-8 mt-4')}>
        {/* Avatar */}
        <div className='flex-shrink-0'>
          {comment.avatar ? (
            <img
              src={comment.avatar}
              alt={comment.author}
              className={cn('w-10 h-10 rounded-full', ui.background.muted)}
            />
          ) : (
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground font-semibold',
                ui.background.muted
              )}
            >
              {comment.author.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className='flex-1 min-w-0'>
          {/* Header */}
          <div className='flex items-center gap-2 mb-1'>
            <span className={cn('font-semibold', ui.text.strong)}>
              {comment.author}
            </span>
            <span className={cn('text-sm', ui.text.muted)}>
              {comment.timestamp}
            </span>
          </div>

          {/* Content */}
          <p className={cn(ui.text.body, 'mb-2')}>{comment.content}</p>

          {/* Actions */}
          <div className='flex items-center gap-4 text-sm'>
            {onReply && canNest && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className={cn(ui.text.linkSubtle)}
              >
                Reply
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(comment.id)}
                className={cn(ui.text.error, 'hover:underline')}
              >
                Delete
              </button>
            )}
          </div>

          {/* Reply form */}
          {replyingTo === comment.id && (
            <div className='mt-3 flex gap-2'>
              <input
                type='text'
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                placeholder='Write a reply...'
                className={cn(
                  'flex-1 px-3 py-2 border',
                  colors.component.input.default.base,
                  colors.component.input.default.dark,
                  ui.border.radius
                )}
              />
              <button
                onClick={() => handleSubmitReply(comment.id)}
                className={cn(
                  'px-4 py-2 rounded-lg',
                  colors.component.button.primary.base,
                  colors.component.button.primary.dark,
                  ui.transition.default
                )}
              >
                Post
              </button>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyContent('');
                }}
                className={cn(
                  'px-4 py-2 rounded-lg',
                  colors.component.button.secondary.base,
                  colors.component.button.secondary.dark,
                  ui.transition.default
                )}
              >
                Cancel
              </button>
            </div>
          )}

          {/* Nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className='mt-4'>
              {comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      {comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};
