import { useState } from 'react';
import { Bookmark, Plus, Trash2, Clock, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useMemorization } from '@/hooks/useMemorization';
import { SURAHS } from '@/data/surahs';

interface MemorizationPanelProps {
  currentSurahId?: number;
  currentTime: number;
  onSeekTo: (time: number) => void;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export function MemorizationPanel({ currentSurahId, currentTime, onSeekTo }: MemorizationPanelProps) {
  const [note, setNote] = useState('');
  const { bookmarks, addBookmark, removeBookmark, progress, markMemorized, resetProgress } = useMemorization();

  const handleAddBookmark = () => {
    if (currentSurahId) {
      addBookmark(currentSurahId, currentTime, note);
      setNote('');
    }
  };

  const currentSurahBookmarks = bookmarks.filter(b => b.surahId === currentSurahId);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bookmark className="w-5 h-5 text-primary" />
          Memorization Tools
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 overflow-y-auto">
        {/* Progress */}
        <div className="space-y-1">
          <h4 className="font-medium text-sm">Progress: {progress}%</h4>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex gap-2 mt-2">
            <Button size="sm" variant="outline" onClick={() => markMemorized(currentSurahId || 0)}>
              Mark Memorized
            </Button>
            <Button size="sm" variant="outline" onClick={resetProgress}>
              Reset
            </Button>
          </div>
        </div>

        {/* Add Bookmark */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Add Bookmark</h4>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-mono">{formatTime(currentTime)}</span>
          </div>
          <Input
            placeholder="Add a note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="text-sm"
          />
          <Button
            size="sm"
            onClick={handleAddBookmark}
            disabled={!currentSurahId}
            className="w-full flex items-center justify-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add Bookmark
          </Button>
        </div>

        {/* Bookmarks List */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">
            Bookmarks {currentSurahId && `(${currentSurahBookmarks.length})`}
          </h4>
          {currentSurahBookmarks.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              No bookmarks for this Surah
            </p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {currentSurahBookmarks.map((bookmark, index) => {
                const surah = SURAHS.find(s => s.id === bookmark.surahId);
                return (
                  <div
                    key={index}
                    className="p-2 rounded-md border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => onSeekTo(bookmark.timestamp)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {formatTime(bookmark.timestamp)}
                          </Badge>
                          <span className="text-xs text-muted-foreground truncate">
                            {surah?.transliteration}
                          </span>
                        </div>
                        {bookmark.note && (
                          <p className="text-xs text-foreground truncate">{bookmark.note}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmark(index);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Edit3 className="w-3 h-3 mr-1" /> A-B Loop
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Review
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
