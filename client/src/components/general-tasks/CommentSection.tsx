import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Comment {
  _id: string;
  content: string;
  author: { name: string; profileImage?: string };
  createdAt: string;
  parentId?: string;
}

type CommentSectionProps = {
  taskId: string;
  comments: Comment[];
  onUpdate: () => void;
};

export function CommentSection({
  taskId,
  comments,
  onUpdate,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty.');
      return;
    }
    setIsPostingComment(true);
    try {
      await api.post(`/tasks/${taskId}/comments`, {
        content: newComment.trim(),
      });
      toast.success('Comment posted successfully!');
      setNewComment('');
      onUpdate();
    } catch (error) {
      toast.error('Failed to post comment. Please try again.');
    } finally {
      setIsPostingComment(false);
    }
  };

  const topLevelComments = comments.filter((comment) => !comment.parentId);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">Comments & Updates ({comments.length})</h3>

      <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
        {topLevelComments.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No comments yet. Start the conversation!</p>
        ) : (
          topLevelComments.map((comment) => (
            <div key={comment._id} className="flex gap-2.5 p-2.5 rounded-md bg-muted/30 border border-border/40">
              <Avatar className="h-7 w-7 mt-0.5 shrink-0">
                <AvatarImage src={comment.author?.profileImage} alt={comment.author?.name} />
                <AvatarFallback className="text-[10px]">
                  {comment.author?.name ? comment.author.name.charAt(0).toUpperCase() : 'C'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-foreground">{comment.author?.name || 'User'}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : ''}
                  </span>
                </div>
                <p className="mt-1 text-muted-foreground leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddComment} className="space-y-2 pt-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={2}
          className="text-xs"
        />
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={isPostingComment || !newComment.trim()} className="gap-1.5 text-xs">
            <Send className="h-3 w-3" />
            {isPostingComment ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </form>
    </div>
  );
}
