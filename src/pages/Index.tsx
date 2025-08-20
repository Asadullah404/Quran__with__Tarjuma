// import { useState, useEffect } from 'react';
// import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
// import { useAudioPlayer } from '@/hooks/useAudioPlayer';
// import { useMemorization } from '@/hooks/useMemorization';
// import { PlayerHeader } from '@/components/PlayerHeader';
// import { SurahList } from '@/components/SurahList';
// import { AudioControls } from '@/components/AudioControls';
// import { VisualizerContainer } from '@/components/VisualizerContainer';
// import { AppSidebar } from '@/components/AppSidebar';

// const Index = () => {
//   const [isDarkMode, setIsDarkMode] = useState(false);
  
//   const {
//     currentSurah,
//     isPlaying,
//     currentTime,
//     duration,
//     mode,
//     autoplayNext,
//     volume,
//     playbackRate,
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
//     audioElement,
//   } = useAudioPlayer();

//   const {
//     isLooping,
//     toggleLoop,
//   } = useMemorization();

//   // Theme management
//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
//     setIsDarkMode(shouldBeDark);
//     document.documentElement.classList.toggle('dark', shouldBeDark);
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = !isDarkMode;
//     setIsDarkMode(newTheme);
//     document.documentElement.classList.toggle('dark', newTheme);
//     localStorage.setItem('theme', newTheme ? 'dark' : 'light');
//   };

//   const handlePlay = () => {
//     if (currentSurah) {
//       playSurah(currentSurah, currentTime);
//     }
//   };

//   return (
//     <SidebarProvider>
//       <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
//         {/* Header */}
//         <PlayerHeader
//           lastPlayedSurah={currentSurah}
//           lastPlayedTime={currentTime}
//           mode={mode}
//           autoplayNext={autoplayNext}
//           onResumeLastPlayed={resumeLastPlayed}
//           onModeChange={setMode}
//           onAutoplayToggle={setAutoplayNext}
//           onThemeToggle={toggleTheme}
//           isDarkMode={isDarkMode}
//         />

//         {/* Main Content */}
//         <div className="flex flex-1 relative">
//           {/* Sidebar */}
//           <AppSidebar
//             currentSurah={currentSurah}
//             isPlaying={isPlaying}
//             onPlaySurah={playSurah}
//             onPause={pause}
//           />

//           {/* Main Content Area */}
//           <main className="flex-1 flex flex-col relative">
//             {/* 3D Visualizer */}
//             <div className="flex-1 relative min-h-[400px]">
//               <VisualizerContainer
//                 audioElement={audioElement}
//                 isPlaying={isPlaying}
//                 className="absolute inset-0"
//               />
              
//               {/* Overlay welcome message when no audio is playing */}
//               {!currentSurah && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-sm">
//                   <div className="text-center space-y-4 animate-fade-in">
//                     <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center animate-glow">
//                       <span className="text-primary-foreground font-bold text-3xl">ق</span>
//                     </div>
//                     <h1 className="text-4xl font-bold text-primary animate-float">
//                       Welcome to Qur'an Player
//                     </h1>
//                     <p className="text-xl text-muted-foreground max-w-md">
//                       Experience the divine recitation with immersive 3D visualizations and advanced memorization tools
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                       Select a Surah from the sidebar to begin your spiritual journey
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Audio Controls */}
//             <div className="sticky bottom-0 z-10">
//               <AudioControls
//                 currentSurah={currentSurah}
//                 isPlaying={isPlaying}
//                 currentTime={currentTime}
//                 duration={duration}
//                 volume={volume}
//                 playbackRate={playbackRate}
//                 isLooping={isLooping}
//                 onPlay={handlePlay}
//                 onPause={pause}
//                 onNext={playNext}
//                 onPrevious={playPrevious}
//                 onSeek={seekTo}
//                 onVolumeChange={setVolume}
//                 onPlaybackRateChange={setPlaybackRate}
//                 onToggleLoop={toggleLoop}
//               />
//             </div>
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default Index;

import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useMemorization } from "@/hooks/useMemorization";
import { PlayerHeader } from "@/components/PlayerHeader";
import { SurahList } from "@/components/SurahList";
import { AudioControls } from "@/components/AudioControls";
import { VisualizerContainer } from "@/components/VisualizerContainer";
import { AppSidebar } from "@/components/AppSidebar";

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const {
    currentSurah,
    isPlaying,
    currentTime,
    duration,
    mode,
    autoplayNext,
    volume,
    playbackRate,
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
    audioElement, // now a ref, not current
  } = useAudioPlayer();

  const { isLooping, toggleLoop } = useMemorization();

  // 🔹 Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    setIsDarkMode(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const handlePlay = () => {
    if (currentSurah) {
      playSurah(currentSurah, currentTime);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
        {/* Header */}
        <PlayerHeader
          lastPlayedSurah={currentSurah}
          lastPlayedTime={currentTime}
          mode={mode}
          autoplayNext={autoplayNext}
          onResumeLastPlayed={resumeLastPlayed}
          onModeChange={setMode}
          onAutoplayToggle={setAutoplayNext}
          onThemeToggle={toggleTheme}
          isDarkMode={isDarkMode}
        />

        {/* Main Content */}
        <div className="flex flex-1 relative">
          {/* Sidebar */}
          <AppSidebar
            currentSurah={currentSurah}
            isPlaying={isPlaying}
            onPlaySurah={playSurah}
            onPause={pause}
          />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col relative">
            {/* 3D Visualizer */}
            <div className="flex-1 relative min-h-[400px]">
              <VisualizerContainer
                audioElement={audioElement.current || null}
                isPlaying={isPlaying}
                className="absolute inset-0"
              />

              {/* Overlay welcome message when no audio is playing */}
              {!currentSurah && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-sm">
                  <div className="text-center space-y-4 animate-fade-in">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center animate-glow">
                      <span className="text-primary-foreground font-bold text-3xl">
                        ق
                      </span>
                    </div>
                    <h1 className="text-4xl font-bold text-primary animate-float">
                      Welcome to Qur&apos;an Player
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-md">
                      Experience the divine recitation with immersive 3D visualizations and advanced memorization tools
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Select a Surah from the sidebar to begin your spiritual journey
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Audio Controls */}
            <div className="sticky bottom-0 z-10">
              <AudioControls
                currentSurah={currentSurah}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                volume={volume}
                playbackRate={playbackRate}
                isLooping={isLooping}
                onPlay={handlePlay}
                onPause={pause}
                onNext={playNext}
                onPrevious={playPrevious}
                onSeek={seekTo}
                onVolumeChange={setVolume}
                onPlaybackRateChange={setPlaybackRate}
                onToggleLoop={toggleLoop}
              />
            </div>
          </main>
        </div>

        {/* 🔹 Hidden Audio Element (real DOM element for playback) */}
        <audio ref={audioElement} hidden />
      </div>
    </SidebarProvider>
  );
};

export default Index;
