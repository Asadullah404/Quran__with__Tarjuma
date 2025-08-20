import { Play, Pause, SkipBack, SkipForward, Volume2, RotateCcw, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Surah } from '@/types/quran';
import { cn } from '@/lib/utils';

interface AudioControlsProps {
  currentSurah: Surah | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isLooping?: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onPlaybackRateChange: (rate: number) => void;
  onToggleLoop?: () => void;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export function AudioControls({
  currentSurah,
  isPlaying,
  currentTime,
  duration,
  volume,
  playbackRate,
  isLooping,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onPlaybackRateChange,
  onToggleLoop,
}: AudioControlsProps) {
  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="border-t-2 border-primary/20 shadow-lg">
      <CardContent className="p-6">
        {/* Current Surah Info */}
        {currentSurah && (
          <div className="text-center mb-4">
            <h3 className="font-bold text-primary text-lg mb-1">
              {currentSurah.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {currentSurah.transliteration} - {currentSurah.translation}
            </p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-6">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={([value]) => onSeek(value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevious}
            className="hover:bg-primary/10"
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button
            size="lg"
            onClick={isPlaying ? onPause : onPlay}
            disabled={!currentSurah}
            className={cn(
              "w-14 h-14 rounded-full transition-all duration-300",
              isPlaying && "animate-glow"
            )}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
            className="hover:bg-primary/10"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Volume Control */}
          <div className="flex items-center gap-2 flex-1">
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              onValueChange={([value]) => onVolumeChange(value / 100)}
              className="flex-1 max-w-24"
            />
          </div>

          {/* Speed Control */}
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-muted-foreground" />
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-primary/10 min-w-12 justify-center"
              onClick={() => {
                const rates = [0.5, 0.75, 1.0, 1.25, 1.5];
                const currentIndex = rates.indexOf(playbackRate);
                const nextRate = rates[(currentIndex + 1) % rates.length];
                onPlaybackRateChange(nextRate);
              }}
            >
              {playbackRate}x
            </Badge>
          </div>

          {/* Loop Toggle */}
          {onToggleLoop && (
            <Button
              variant={isLooping ? "default" : "outline"}
              size="icon"
              onClick={onToggleLoop}
              className={cn(
                "transition-all duration-300",
                isLooping && "animate-glow"
              )}
            >
              <Repeat className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}