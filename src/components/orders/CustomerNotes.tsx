import React, { useState } from 'react';
import { MessageCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCustomerNotes } from '@/hooks/orders/useCustomerNotes';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface CustomerNotesProps {
  customerPhone: string;
  orderId: string;
  showAddNote?: boolean;
}

export function CustomerNotes({ customerPhone, orderId, showAddNote = false }: CustomerNotesProps) {
  const [newNote, setNewNote] = useState('');
  const [showInput, setShowInput] = useState(false);
  const { notes, isLoading, addNote, isAddingNote } = useCustomerNotes(customerPhone);

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote({ orderId, content: newNote.trim() });
      setNewNote('');
      setShowInput(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="font-medium flex items-center">
          <MessageCircle className="w-4 h-4 mr-2" />
          历史服务备注
        </h3>
        <p className="text-sm text-muted-foreground">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center">
          <MessageCircle className="w-4 h-4 mr-2" />
          历史服务备注
        </h3>
        {showAddNote && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInput(!showInput)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>

      {showInput && (
        <div className="space-y-2">
          <Textarea
            placeholder="记录用户家的清洁重点、物品摆放、特殊要求等..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setShowInput(false)}>
              取消
            </Button>
            <Button 
              size="sm" 
              onClick={handleAddNote}
              disabled={!newNote.trim() || isAddingNote}
            >
              {isAddingNote ? '保存中...' : '保存'}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3 max-h-40 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">暂无服务备注</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm mb-1">{note.content}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(note.created_at), { 
                  locale: zhCN, 
                  addSuffix: true 
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}