import { Play, Moon, Sun, Settings, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Surah } from '@/types/quran';
import { cn } from '@/lib/utils';

interface PlayerHeaderProps {
  lastPlayedSurah: Surah | null;
  lastPlayedTime: number;
  mode: 'continuous' | 'manual';
  autoplayNext: boolean;
  onResumeLastPlayed: () => void;
  onModeChange: (mode: 'continuous' | 'manual') => void;
  onAutoplayToggle: (enabled: boolean) => void;
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export function PlayerHeader({
  lastPlayedSurah,
  lastPlayedTime,
  mode,
  autoplayNext,
  onResumeLastPlayed,
  onModeChange,
  onAutoplayToggle,
  onThemeToggle,
  isDarkMode,
}: PlayerHeaderProps) {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center animate-glow overflow-hidden">
  <img src="/vite.png" alt="Logo" className="w-32 h-32 object-contain" />
</div>

            <div>
              <h1 className="text-xl font-bold text-primary">
                Qur'an Player
              </h1>
              <p className="text-xs text-muted-foreground">
                Spiritual Recitation Experience
              </p>
            </div>
          </div>

          {/* Last Played Section */}
          {lastPlayedSurah && (
            <Card className="flex-1 max-w-sm animate-fade-in">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground mb-1">
                      Last Played
                    </p>
                    <p className="font-medium text-sm truncate">
                      {lastPlayedSurah.transliteration}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      at {formatTime(lastPlayedTime)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={onResumeLastPlayed}
                    className="ml-2 animate-gentle-pulse"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Resume
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Playback Mode */}
            <div className="flex items-center gap-2">
              <Badge
                variant={mode === 'continuous' ? 'default' : 'outline'}
                className={cn(
                  "cursor-pointer transition-all duration-300 hover:scale-105",
                  mode === 'continuous' && "animate-gentle-pulse"
                )}
                onClick={() => onModeChange(mode === 'continuous' ? 'manual' : 'continuous')}
              >
                {mode === 'continuous' ? 'Continuous' : 'Manual'}
              </Badge>
            </div>

            {/* Autoplay Toggle */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground cursor-pointer">
                Autoplay
              </label>
              <Switch
                checked={autoplayNext}
                onCheckedChange={onAutoplayToggle}
              />
            </div>

            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={onThemeToggle}
              className="transition-all duration-300 hover:rotate-180"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* Settings */}
            {/* <Button
              variant="outline"
              size="icon"
              className="hover:bg-primary/10"
            >
              <Settings className="w-4 h-4" />
            </Button> */}
          </div>
        </div>
      </div>
    </header>
  );
}