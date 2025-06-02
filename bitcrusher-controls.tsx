import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface BitcrusherSettings {
  bitDepth: number;
  frequencyReduction: number;
}

interface BitcrusherControlsProps {
  settings: BitcrusherSettings;
  onChange: (settings: Partial<BitcrusherSettings>) => void;
}

export function BitcrusherControls({ settings, onChange }: BitcrusherControlsProps) {
  return (
    <Card className="bg-[hsl(var(--dark-800))] border-[hsl(var(--dark-600))] p-6">
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-[hsl(var(--accent-blue))]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
        </svg>
        Bitcrusher Settings
      </h2>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="bitDepth" className="block text-sm font-medium text-[hsl(var(--text-primary))] mb-3">
            Bit Depth
          </Label>
          <Slider
            value={[settings.bitDepth]}
            onValueChange={(value) => onChange({ bitDepth: value[0] })}
            min={1}
            max={16}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[hsl(var(--text-muted))] mt-1">
            <span>1-bit</span>
            <span className="text-[hsl(var(--accent-blue))] font-mono">{settings.bitDepth}-bit</span>
            <span>16-bit</span>
          </div>
        </div>
        
        <div>
          <Label htmlFor="frequencyReduction" className="block text-sm font-medium text-[hsl(var(--text-primary))] mb-3">
            Frequency Reduction
          </Label>
          <Slider
            value={[settings.frequencyReduction]}
            onValueChange={(value) => onChange({ frequencyReduction: value[0] })}
            min={1}
            max={20}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[hsl(var(--text-muted))] mt-1">
            <span>1x</span>
            <span className="text-[hsl(var(--accent-blue))] font-mono">{settings.frequencyReduction}x</span>
            <span>20x</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
