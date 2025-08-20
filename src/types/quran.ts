export interface Surah {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: 'meccan' | 'medinan';
  total_verses: number;
  audio_url: string;
  duration?: number;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentSurah: Surah | null;
  currentTime: number;
  duration: number;
  mode: 'continuous' | 'manual';
  autoplayNext: boolean;
  volume: number;
  playbackRate: number;
}

export interface MemorizationState {
  bookmarks: Array<{
    surahId: number;
    timestamp: number;
    note?: string;
  }>;
  loopStart?: number;
  loopEnd?: number;
  isLooping: boolean;
}

export interface VisualizerMode {
  id: string;
  name: string;
  description: string;
}

export const VISUALIZER_MODES: VisualizerMode[] = [
  { id: 'starfield', name: 'Starfield Galaxy', description: 'Stars light up with each verse' },
  { id: 'geometric', name: 'Islamic Geometry', description: 'Sacred patterns morphing with rhythm' },
  { id: 'dunes', name: 'Desert Dunes', description: 'Sand ripples with divine recitation' },
  { id: 'calligraphy', name: 'Glowing Calligraphy', description: '3D Arabic calligraphy animations' },
  { id: 'particles', name: 'Light Particles', description: 'Divine light particles dancing' }
];