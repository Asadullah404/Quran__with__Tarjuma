import { Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Surah } from '@/types/quran';
import { SURAHS } from '@/data/surahs';
import { cn } from '@/lib/utils';

interface SurahListProps {
  currentSurah: Surah | null;
  isPlaying: boolean;
  onPlaySurah: (surah: Surah) => void;
  onPause: () => void;
}

export function SurahList({ currentSurah, isPlaying, onPlaySurah, onPause }: SurahListProps) {
  const handlePlayClick = (surah: Surah) => {
    if (currentSurah?.id === surah.id && isPlaying) {
      onPause();
    } else {
      onPlaySurah(surah);
    }
  };

  return (
    <div className="h-full overflow-y-auto space-y-2 p-4">
      <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
        <Volume2 className="w-5 h-5" />
        Qur'an Surahs
      </h2>
      
      {SURAHS.map((surah) => {
        const isCurrentSurah = currentSurah?.id === surah.id;
        const isCurrentlyPlaying = isCurrentSurah && isPlaying;
        
        return (
          <Card 
            key={surah.id} 
            className={cn(
              "transition-all duration-300 hover:shadow-lg cursor-pointer group",
              isCurrentSurah && "ring-2 ring-primary bg-primary/5 animate-gentle-pulse"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge 
                      variant="outline" 
                      className="text-xs font-mono shrink-0"
                    >
                      {surah.id}
                    </Badge>
                    <h3 className="font-bold text-lg text-primary truncate">
                      {surah.name}
                    </h3>
                  </div>
                  
                  <p className="text-sm font-medium text-foreground mb-1">
                    {surah.transliteration}
                  </p>
                  
                  <p className="text-xs text-muted-foreground mb-2">
                    {surah.translation}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge 
                      variant={surah.type === 'meccan' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {surah.type}
                    </Badge>
                    <span>{surah.total_verses} verses</span>
                  </div>
                </div>
                
                <Button
                  variant={isCurrentSurah ? "default" : "outline"}
                  size="icon"
                  className={cn(
                    "ml-4 shrink-0 transition-all duration-300",
                    isCurrentlyPlaying && "animate-glow",
                    !surah.audio_url && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => handlePlayClick(surah)}
                  disabled={!surah.audio_url}
                >
                  {isCurrentlyPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              {!surah.audio_url && (
                <p className="text-xs text-destructive mt-2">
                  Audio URL not provided
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}