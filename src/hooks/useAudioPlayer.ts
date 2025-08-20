// import { useState, useRef, useEffect, useCallback } from 'react';
// import { Surah, PlaybackState } from '@/types/quran';
// import { SURAHS } from '@/data/surahs';

// const STORAGE_KEY = 'quran_player_state';

// export const useAudioPlayer = () => {
//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const [state, setState] = useState<PlaybackState>({
//     isPlaying: false,
//     currentSurah: null,
//     currentTime: 0,
//     duration: 0,
//     mode: 'manual',
//     autoplayNext: false,
//     volume: 0.8,
//     playbackRate: 1.0,
//   });

//   // Load saved state from localStorage
//   useEffect(() => {
//     const savedState = localStorage.getItem(STORAGE_KEY);
//     if (savedState) {
//       try {
//         const parsed = JSON.parse(savedState);
//         setState(prevState => ({ ...prevState, ...parsed, isPlaying: false }));
//       } catch (error) {
//         console.error('Error loading saved state:', error);
//       }
//     }
//   }, []);

//   // Save state to localStorage
//   const saveState = useCallback((newState: Partial<PlaybackState>) => {
//     const stateToSave = {
//       currentSurah: newState.currentSurah || state.currentSurah,
//       currentTime: newState.currentTime ?? state.currentTime,
//       mode: newState.mode || state.mode,
//       autoplayNext: newState.autoplayNext ?? state.autoplayNext,
//       volume: newState.volume ?? state.volume,
//       playbackRate: newState.playbackRate ?? state.playbackRate,
//     };
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
//   }, [state]);

//   // Initialize audio element
//   useEffect(() => {
//     if (!audioRef.current) {
//       audioRef.current = new Audio();
//       audioRef.current.crossOrigin = 'anonymous';
      
//       // Audio event listeners
//       const audio = audioRef.current;
      
//       const handleLoadedMetadata = () => {
//         setState(prev => ({ ...prev, duration: audio.duration }));
//       };
      
//       const handleTimeUpdate = () => {
//         setState(prev => {
//           const newState = { ...prev, currentTime: audio.currentTime };
//           saveState(newState);
//           return newState;
//         });
//       };
      
//       const handleEnded = () => {
//         setState(prev => ({ ...prev, isPlaying: false }));
//         if (state.autoplayNext && state.mode === 'continuous') {
//           playNext();
//         }
//       };
      
//       const handlePlay = () => setState(prev => ({ ...prev, isPlaying: true }));
//       const handlePause = () => setState(prev => ({ ...prev, isPlaying: false }));
      
//       audio.addEventListener('loadedmetadata', handleLoadedMetadata);
//       audio.addEventListener('timeupdate', handleTimeUpdate);
//       audio.addEventListener('ended', handleEnded);
//       audio.addEventListener('play', handlePlay);
//       audio.addEventListener('pause', handlePause);
      
//       return () => {
//         audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
//         audio.removeEventListener('timeupdate', handleTimeUpdate);
//         audio.removeEventListener('ended', handleEnded);
//         audio.removeEventListener('play', handlePlay);
//         audio.removeEventListener('pause', handlePause);
//       };
//     }
//   }, [state.autoplayNext, state.mode, saveState]);

//   const playSurah = useCallback((surah: Surah, startTime = 0) => {
//     if (!audioRef.current || !surah.audio_url) return;
    
//     const audio = audioRef.current;
    
//     if (state.currentSurah?.id !== surah.id) {
//       audio.src = surah.audio_url;
//       setState(prev => {
//         const newState = { ...prev, currentSurah: surah, currentTime: startTime };
//         saveState(newState);
//         return newState;
//       });
//     }
    
//     audio.currentTime = startTime;
//     audio.volume = state.volume;
//     audio.playbackRate = state.playbackRate;
//     audio.play();
//   }, [state.currentSurah, state.volume, state.playbackRate, saveState]);

//   const pause = useCallback(() => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//     }
//   }, []);

//   const playNext = useCallback(() => {
//     if (!state.currentSurah) return;
    
//     const currentIndex = SURAHS.findIndex(s => s.id === state.currentSurah!.id);
//     const nextSurah = SURAHS[currentIndex + 1];
    
//     if (nextSurah) {
//       playSurah(nextSurah);
//     }
//   }, [state.currentSurah, playSurah]);

//   const playPrevious = useCallback(() => {
//     if (!state.currentSurah) return;
    
//     const currentIndex = SURAHS.findIndex(s => s.id === state.currentSurah!.id);
//     const prevSurah = SURAHS[currentIndex - 1];
    
//     if (prevSurah) {
//       playSurah(prevSurah);
//     }
//   }, [state.currentSurah, playSurah]);

//   const seekTo = useCallback((time: number) => {
//     if (audioRef.current) {
//       audioRef.current.currentTime = time;
//       setState(prev => {
//         const newState = { ...prev, currentTime: time };
//         saveState(newState);
//         return newState;
//       });
//     }
//   }, [saveState]);

//   const setVolume = useCallback((volume: number) => {
//     if (audioRef.current) {
//       audioRef.current.volume = volume;
//       setState(prev => {
//         const newState = { ...prev, volume };
//         saveState(newState);
//         return newState;
//       });
//     }
//   }, [saveState]);

//   const setPlaybackRate = useCallback((rate: number) => {
//     if (audioRef.current) {
//       audioRef.current.playbackRate = rate;
//       setState(prev => {
//         const newState = { ...prev, playbackRate: rate };
//         saveState(newState);
//         return newState;
//       });
//     }
//   }, [saveState]);

//   const setMode = useCallback((mode: 'continuous' | 'manual') => {
//     setState(prev => {
//       const newState = { ...prev, mode };
//       saveState(newState);
//       return newState;
//     });
//   }, [saveState]);

//   const setAutoplayNext = useCallback((autoplay: boolean) => {
//     setState(prev => {
//       const newState = { ...prev, autoplayNext: autoplay };
//       saveState(newState);
//       return newState;
//     });
//   }, [saveState]);

//   const resumeLastPlayed = useCallback(() => {
//     if (state.currentSurah) {
//       playSurah(state.currentSurah, state.currentTime);
//     }
//   }, [state.currentSurah, state.currentTime, playSurah]);

//   return {
//     ...state,
//     playSurah,
//     pause,
//     playNext,
//     playPrevious,
//     seekTo,
//     setVolume,
//     setPlaybackRate,
//     setMode,
//     setAutoplayNext,
//     resumeLastPlayed,
//     audioElement: audioRef.current,
//   };
// };


import { useState, useRef, useEffect, useCallback } from "react";
import { Surah, PlaybackState } from "@/types/quran";
import { SURAHS } from "@/data/surahs";

const STORAGE_KEY = "quran_player_state";

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [state, setState] = useState<PlaybackState>({
    isPlaying: false,
    currentSurah: null,
    currentTime: 0,
    duration: 0,
    mode: "manual",
    autoplayNext: false,
    volume: 0.8,
    playbackRate: 1.0,
  });

  // 🔹 Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState((prevState) => ({
          ...prevState,
          ...parsed,
          isPlaying: false,
        }));
      } catch (error) {
        console.error("Error loading saved state:", error);
      }
    }
  }, []);

  // 🔹 Save state to localStorage
  const saveState = useCallback(
    (newState: Partial<PlaybackState>) => {
      const stateToSave = {
        currentSurah: newState.currentSurah || state.currentSurah,
        currentTime: newState.currentTime ?? state.currentTime,
        mode: newState.mode || state.mode,
        autoplayNext: newState.autoplayNext ?? state.autoplayNext,
        volume: newState.volume ?? state.volume,
        playbackRate: newState.playbackRate ?? state.playbackRate,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    },
    [state]
  );

  // 🔹 Attach event listeners to the <audio> element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.crossOrigin = "anonymous";

    const handleLoadedMetadata = () => {
      setState((prev) => ({ ...prev, duration: audio.duration }));
    };

    const handleTimeUpdate = () => {
      setState((prev) => {
        const newState = { ...prev, currentTime: audio.currentTime };
        saveState(newState);
        return newState;
      });
    };

    const handleEnded = () => {
      setState((prev) => ({ ...prev, isPlaying: false }));
      if (state.autoplayNext && state.mode === "continuous") {
        playNext();
      }
    };

    const handlePlay = () =>
      setState((prev) => ({ ...prev, isPlaying: true }));
    const handlePause = () =>
      setState((prev) => ({ ...prev, isPlaying: false }));

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [state.autoplayNext, state.mode, saveState]);

  // 🔹 Controls
  const playSurah = useCallback(
    (surah: Surah, startTime = 0) => {
      const audio = audioRef.current;
      if (!audio || !surah.audio_url) return;

      if (state.currentSurah?.id !== surah.id) {
        audio.src = surah.audio_url;
        setState((prev) => {
          const newState = { ...prev, currentSurah: surah, currentTime: startTime };
          saveState(newState);
          return newState;
        });
      }

      audio.currentTime = startTime;
      audio.volume = state.volume;
      audio.playbackRate = state.playbackRate;

      audio.play().catch((err) => {
        console.warn("Playback prevented:", err);
      });
    },
    [state.currentSurah, state.volume, state.playbackRate, saveState]
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const playNext = useCallback(() => {
    if (!state.currentSurah) return;
    const currentIndex = SURAHS.findIndex((s) => s.id === state.currentSurah!.id);
    const nextSurah = SURAHS[currentIndex + 1];
    if (nextSurah) playSurah(nextSurah);
  }, [state.currentSurah, playSurah]);

  const playPrevious = useCallback(() => {
    if (!state.currentSurah) return;
    const currentIndex = SURAHS.findIndex((s) => s.id === state.currentSurah!.id);
    const prevSurah = SURAHS[currentIndex - 1];
    if (prevSurah) playSurah(prevSurah);
  }, [state.currentSurah, playSurah]);

  const seekTo = useCallback(
    (time: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
        setState((prev) => {
          const newState = { ...prev, currentTime: time };
          saveState(newState);
          return newState;
        });
      }
    },
    [saveState]
  );

  const setVolume = useCallback(
    (volume: number) => {
      if (audioRef.current) {
        audioRef.current.volume = volume;
        setState((prev) => {
          const newState = { ...prev, volume };
          saveState(newState);
          return newState;
        });
      }
    },
    [saveState]
  );

  const setPlaybackRate = useCallback(
    (rate: number) => {
      if (audioRef.current) {
        audioRef.current.playbackRate = rate;
        setState((prev) => {
          const newState = { ...prev, playbackRate: rate };
          saveState(newState);
          return newState;
        });
      }
    },
    [saveState]
  );

  const setMode = useCallback(
    (mode: "continuous" | "manual") => {
      setState((prev) => {
        const newState = { ...prev, mode };
        saveState(newState);
        return newState;
      });
    },
    [saveState]
  );

  const setAutoplayNext = useCallback(
    (autoplay: boolean) => {
      setState((prev) => {
        const newState = { ...prev, autoplayNext: autoplay };
        saveState(newState);
        return newState;
      });
    },
    [saveState]
  );

  const resumeLastPlayed = useCallback(() => {
    if (state.currentSurah) {
      playSurah(state.currentSurah, state.currentTime);
    }
  }, [state.currentSurah, state.currentTime, playSurah]);

  return {
    ...state,
    playSurah,
    pause,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    setPlaybackRate,
    setMode,
    setAutoplayNext,
    resumeLastPlayed,
    audioElement: audioRef, // 🔹 return ref, not current
  };
};
