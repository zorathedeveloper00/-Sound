import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export function VolumeControl({ volume, onVolumeChange }: VolumeControlProps) {
  const handleVolumeChange = (value: number[]) => {
    onVolumeChange(value[0]);
  };

  return (
    <Card className="bg-[hsl(var(--dark-800))] border-[hsl(var(--dark-600))] p-6">
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-[hsl(var(--accent-blue))]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
        </svg>
        Master Volume
      </h2>
      
      <div className="text-center">
        <div className="relative mb-4">
          <Slider
            value={[volume]}
            onValueChange={handleVolumeChange}
            min={0}
            max={2}
            step={0.01}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[hsl(var(--text-muted))] mt-1">
            <span>0</span>
            <span>1</span>
            <span>2</span>
          </div>
        </div>
        <div className="text-center">
          <span className="text-2xl font-bold text-[hsl(var(--accent-blue))]">
            {Math.round(volume * 100)}%
          </span>
          <p className="text-xs text-[hsl(var(--text-muted))]">Master Level</p>
        </div>
      </div>
    </Card>
  );
}
