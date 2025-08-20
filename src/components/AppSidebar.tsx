import { Sidebar, SidebarContent, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { SurahList } from './SurahList';
import { Surah } from '@/types/quran';

interface AppSidebarProps {
  currentSurah: Surah | null;
  isPlaying: boolean;
  onPlaySurah: (surah: Surah) => void;
  onPause: () => void;
}

export function AppSidebar({ currentSurah, isPlaying, onPlaySurah, onPause }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <div className="flex">
      {/* Trigger stays outside so it’s always visible */}
      <div className="p-2 border-r border-border/50">
        <SidebarTrigger />
      </div>

      <Sidebar
        className={isCollapsed ? "w-16" : "w-80"}
        collapsible="icon"
      >
        <SidebarContent className="h-full">
          {!isCollapsed ? (
            <SurahList
              currentSurah={currentSurah}
              isPlaying={isPlaying}
              onPlaySurah={onPlaySurah}
              onPause={onPause}
            />
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground transform -rotate-90 whitespace-nowrap">
                Surahs
              </p>
            </div>
          )}
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
