import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface EffectsEnabled {
  compressor: boolean;
  reverb: boolean;
  bitcrusher: boolean;
}

interface AudioEffectsProps {
  effectsEnabled: EffectsEnabled;
  onToggleEffect: (effect: keyof EffectsEnabled) => void;
}

const effects = [
  {
    key: 'compressor' as const,
    label: 'Compressor',
    description: 'Dynamic Range Control',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2,12A2,2 0 0,1 4,10H6.5L12,5.5L17.5,10H20A2,2 0 0,1 22,12A2,2 0 0,1 20,14H17.5L12,18.5L6.5,14H4A2,2 0 0,1 2,12Z" />
      </svg>
    )
  },
  {
    key: 'reverb' as const,
    label: 'Reverb',
    description: 'Spatial Enhancement',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16Z" />
      </svg>
    )
  },
  {
    key: 'bitcrusher' as const,
    label: 'Bitcrusher',
    description: 'Lo-Fi Distortion',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17,17H7V7H17M21,11V9H19V7C19,5.89 18.1,5 17,5H15V3H13V5H11V3H9V5H7C5.89,5 5,5.89 5,7V9H3V11H5V13H3V15H5V17C5,18.1 5.9,19 7,19H9V21H11V19H13V21H15V19H17C18.1,19 19,18.1 19,17V15H21V13H19V11M17,13H7V11H17V13Z" />
      </svg>
    )
  }
];

export function AudioEffects({ effectsEnabled, onToggleEffect }: AudioEffectsProps) {
  return (
    <Card className="bg-[hsl(var(--dark-800))] border-[hsl(var(--dark-600))] p-6">
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-[hsl(var(--accent-blue))]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7,2V4H9V2H15V4H17V2H19V4H20A2,2 0 0,1 22,6V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V6A2,2 0 0,1 4,4H5V2H7M4,8V20H20V8H4M8,10H16V12H8V10M8,14H13V16H8V14Z" />
        </svg>
        Audio Effects Rack
      </h2>
      
      <div className="space-y-6">
        {effects.map((effect) => (
          <div key={effect.key} className="flex items-center justify-between p-4 bg-[hsl(var(--dark-700))] rounded-lg">
            <div className="flex items-center">
              <div className="text-[hsl(var(--accent-blue))] mr-3">
                {effect.icon}
              </div>
              <div>
                <div className="text-white font-medium">{effect.label}</div>
                <div className="text-xs text-[hsl(var(--text-muted))]">{effect.description}</div>
              </div>
            </div>
            <Switch
              checked={effectsEnabled[effect.key]}
              onCheckedChange={() => onToggleEffect(effect.key)}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
