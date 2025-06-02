import { Card } from "@/components/ui/card";

interface StatusDisplayProps {
  audioContext: AudioContext | null;
  hasAudio: boolean;
}

export function StatusDisplay({ audioContext, hasAudio }: StatusDisplayProps) {
  const getContextState = () => {
    if (!audioContext) return 'Not Ready';
    return audioContext.state.charAt(0).toUpperCase() + audioContext.state.slice(1);
  };

  const getSampleRate = () => {
    if (!audioContext) return '44.1 kHz';
    return `${(audioContext.sampleRate / 1000).toFixed(1)} kHz`;
  };

  const getChannels = () => {
    return 'Stereo';
  };

  return (
    <Card className="bg-[hsl(var(--dark-800))] border-[hsl(var(--dark-600))] p-6 mt-8">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${hasAudio && audioContext ? 'bg-[hsl(var(--accent-green))] animate-pulse' : 'bg-[hsl(var(--text-muted))]'}`}></div>
            <span className="text-sm text-[hsl(var(--text-primary))]">System {getContextState()}</span>
          </div>
          <div className="h-4 w-px bg-[hsl(var(--dark-600))]"></div>
          <div className="text-sm text-[hsl(var(--text-muted))]">
            <span>{getSampleRate()}</span> • 
            <span> {getChannels()}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-xs text-[hsl(var(--text-muted))]">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17,17H7V7H17M21,11V9H19V7C19,5.89 18.1,5 17,5H15V3H13V5H11V3H9V5H7C5.89,5 5,5.89 5,7V9H3V11H5V13H3V15H5V17C5,18.1 5.9,19 7,19H9V21H11V19H13V21H15V19H17C18.1,19 19,18.1 19,17V15H21V13H19V11M17,13H7V11H17V13Z" />
            </svg>
            <span>Web Audio API</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10.5V11.5C14.8,12.4 14.4,13.2 13.7,13.7L13.4,13.9C13.1,14 12.9,14.3 12.9,14.6V15H