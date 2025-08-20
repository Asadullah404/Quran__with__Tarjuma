import { useState, useEffect, useRef } from "react";
import { Eye, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VisualizerMode, VISUALIZER_MODES } from "@/types/quran";
import { StarfieldVisualizer } from "./visualizers/StarfieldVisualizer";
import { GeometricVisualizer } from "./visualizers/GeometricVisualizer";
import { cn } from "@/lib/utils";

interface VisualizerContainerProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  className?: string;
}

export function VisualizerContainer({
  audioElement,
  isPlaying,
  className,
}: VisualizerContainerProps) {
  const [currentMode, setCurrentMode] = useState<VisualizerMode>(
    VISUALIZER_MODES[0]
  );
  const [audioData, setAudioData] = useState<Uint8Array>();
  const [showModeSelector, setShowModeSelector] = useState(false);

  // persistent refs (never recreated)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioElement) return;

    // Create AudioContext once
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }

    const audioCtx = audioCtxRef.current;

    // Create MediaElementSource only once per <audio> element
    if (!sourceNodeRef.current) {
      sourceNodeRef.current = audioCtx.createMediaElementSource(audioElement);
      analyserRef.current = audioCtx.createAnalyser();

      sourceNodeRef.current.connect(analyserRef.current!);
      analyserRef.current!.connect(audioCtx.destination);

      analyserRef.current!.fftSize = 256;
    }

    const analyser = analyserRef.current!;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateAudioData = () => {
      analyser.getByteFrequencyData(dataArray);
      setAudioData(new Uint8Array(dataArray));

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(updateAudioData);
      }
    };

    if (isPlaying) {
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      updateAudioData();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [audioElement, isPlaying]);

  const renderVisualizer = () => {
    const props = { audioData, isPlaying };

    switch (currentMode.id) {
      case "starfield":
        return <StarfieldVisualizer {...props} />;
      case "geometric":
        return <GeometricVisualizer {...props} />;
      case "dunes":
        return (
          <div className="w-full h-full bg-gradient-to-b from-yellow-200 to-yellow-600 dark:from-yellow-800 dark:to-yellow-900 flex items-center justify-center">
            <p className="text-foreground text-lg">Desert Dunes - Coming Soon</p>
          </div>
        );
      case "calligraphy":
        return (
          <div className="w-full h-full bg-gradient-to-b from-primary/10 to-accent/20 flex items-center justify-center">
            <p className="text-foreground text-lg">Calligraphy - Coming Soon</p>
          </div>
        );
      case "particles":
        return (
          <div className="w-full h-full bg-gradient-to-b from-background to-primary/5 flex items-center justify-center">
            <p className="text-foreground text-lg">Light Particles - Coming Soon</p>
          </div>
        );
      default:
        return <StarfieldVisualizer {...props} />;
    }
  };

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      {/* Visualizer */}
      <div className="w-full h-full">{renderVisualizer()}</div>

      {/* Mode Selector */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="icon"
          className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
          onClick={() => setShowModeSelector(!showModeSelector)}
        >
          <Eye className="w-4 h-4" />
        </Button>

        {showModeSelector && (
          <Card className="absolute top-12 right-0 w-72 bg-background/90 backdrop-blur-sm animate-fade-in">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4 text-primary" />
                <h3 className="font-medium text-sm">Visualizer Mode</h3>
              </div>

              <div className="space-y-2">
                {VISUALIZER_MODES.map((mode) => (
                  <div
                    key={mode.id}
                    className={cn(
                      "p-2 rounded-md cursor-pointer transition-all duration-200 hover:bg-primary/10",
                      currentMode.id === mode.id &&
                        "bg-primary/20 ring-1 ring-primary"
                    )}
                    onClick={() => {
                      setCurrentMode(mode);
                      setShowModeSelector(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{mode.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {mode.description}
                        </p>
                      </div>
                      {currentMode.id === mode.id && (
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Current Mode Indicator */}
      <div className="absolute bottom-4 left-4 z-10">
        <Badge
          variant="outline"
          className="bg-background/80 backdrop-blur-sm text-xs"
        >
          {currentMode.name}
        </Badge>
      </div>
    </div>
  );
}
