import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface EQValues {
  bass: number;
  lowMid: number;
  mid: number;
  highMid: number;
  treble: number;
}

interface EqualizerProps {
  values: EQValues;
  onChange: (band: keyof EQValues, value: number) => void;
}

const eqBands = [
  { key: 'bass' as const, label: 'Bass', frequency: '60Hz' },
  { key: 'lowMid' as const, label: 'Low Mid', frequency: '250Hz' },
  { key: 'mid' as const, label: 'Mid', frequency: '1kHz' },
  { key: 'highMid' as const, label: 'High Mid', frequency: '4kHz' },
  { key: 'treble' as const, label: 'Treble', frequency: '10kHz' },
];

export function Equalizer({ values, onChange }: EqualizerProps) {
  return (
    <Card className="bg-[hsl(var(--dark-800))] border-[hsl(var(--dark-600))] p-6">
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-[hsl(var(--accent-blue))]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7,12H9V17H7V12M11,7H13V17H11V7M15,9H17V17H15V9M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,5V19H5V5H19Z" />
        </svg>
        5-Band Equalizer
      </h2>
      
      <div className="grid grid-cols-5 gap-4 h-64">
        {eqBands.map((band) => (
          <div key={band.key} className="flex flex-col items-center">
            <div className="flex-1 flex flex-col-reverse items-center relative">
              <div className="h-48 w-8 relative">
                <Slider
                  value={[values[band.key]]}
                  onValueChange={(value) => onChange(band.key, value[0])}
                  min={-30}
                  max={30}
                  step={0.1}
                  orientation="vertical"
                  className="h-full w-full"
                />
              </div>
              <div className="absolute top-0 w-full h-full pointer-events-none flex items-center justify-center">
                <div className="w-1 h-1 bg-[hsl(var(--accent-blue))] rounded-full"></div>
              </div>
            </div>
            <div className="text-center mt-3">
              <div className="text-sm font-medium text-white">{band.label}</div>
              <div className="text-xs text-[hsl(var(--text-muted))]">{band.frequency}</div>
              <div className="text-xs text-[hsl(var(--accent-blue))] font-mono">
                {values[band.key] >= 0 ? '+' : ''}{values[band.key].toFixed(1)}dB
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
