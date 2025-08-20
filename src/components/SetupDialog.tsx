import { useState } from 'react';
import { Upload, Link, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SURAHS, updateSurahAudioUrl } from '@/data/surahs';
import { useToast } from '@/hooks/use-toast';

interface SetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SetupDialog({ open, onOpenChange }: SetupDialogProps) {
  const [currentSurahIndex, setCurrentSurahIndex] = useState(0);
  const [audioUrl, setAudioUrl] = useState('');
  const { toast } = useToast();

  const currentSurah = SURAHS[currentSurahIndex];
  const totalSurahs = SURAHS.length;
  const surahs_with_audio = SURAHS.filter(s => s.audio_url).length;

  const handleSaveUrl = () => {
    if (!audioUrl.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid audio URL",
        variant: "destructive",
      });
      return;
    }

    updateSurahAudioUrl(currentSurah.id, audioUrl.trim());
    
    toast({
      title: "Audio URL saved",
      description: `${currentSurah.transliteration} audio URL has been saved`,
    });

    // Move to next surah
    if (currentSurahIndex < totalSurahs - 1) {
      setCurrentSurahIndex(prev => prev + 1);
      setAudioUrl('');
    } else {
      // All surahs configured
      toast({
        title: "Setup Complete!",
        description: "All Surah audio URLs have been configured",
      });
      onOpenChange(false);
    }
  };

  const handleSkip = () => {
    if (currentSurahIndex < totalSurahs - 1) {
      setCurrentSurahIndex(prev => prev + 1);
      setAudioUrl('');
    } else {
      onOpenChange(false);
    }
  };

  const handlePrevious = () => {
    if (currentSurahIndex > 0) {
      setCurrentSurahIndex(prev => prev - 1);
      setAudioUrl(SURAHS[currentSurahIndex - 1].audio_url || '');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Setup Audio URLs
          </DialogTitle>
          <DialogDescription>
            Configure audio URLs for each Surah to enable playback. You can use Google Drive links or any direct audio URLs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{surahs_with_audio} / {totalSurahs}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(surahs_with_audio / totalSurahs) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Surah */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{currentSurah.id}</Badge>
                    <h3 className="font-bold text-lg">{currentSurah.name}</h3>
                  </div>
                  <p className="text-sm font-medium">{currentSurah.transliteration}</p>
                  <p className="text-xs text-muted-foreground">{currentSurah.translation}</p>
                </div>
                {currentSurah.audio_url && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="audio-url">Audio URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="audio-url"
                    placeholder="Paste Google Drive link or direct audio URL here..."
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSaveUrl}
                    disabled={!audioUrl.trim()}
                  >
                    Save
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  <Link className="w-3 h-3 inline mr-1" />
                  Tip: For Google Drive, use the direct download link format
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSurahIndex === 0}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={handleSkip}
              >
                Skip
              </Button>
              
              {currentSurahIndex === totalSurahs - 1 ? (
                <Button onClick={() => onOpenChange(false)}>
                  Finish Setup
                </Button>
              ) : (
                <Button onClick={() => setCurrentSurahIndex(prev => prev + 1)}>
                  Next Surah
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}