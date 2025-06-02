import { useState, useRef, useCallback, useEffect } from "react";
import { createEQFilters, createCompressor, createReverb, createBitcrusher, audioBufferToWav } from "@/lib/audio-utils";

interface EQValues {
  bass: number;
  lowMid: number;
  mid: number;
  highMid: number;
  treble: number;
}

interface EffectsEnabled {
  compressor: boolean;
  reverb: boolean;
  bitcrusher: boolean;
}

interface BitcrusherSettings {
  bitDepth: number;
  frequencyReduction: number;
}

export function useAudioContext() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const [eqValues, setEQValues] = useState<EQValues>({
    bass: 0,
    lowMid: 0,
    mid: 0,
    highMid: 0,
    treble: 0
  });
  const [effectsEnabled, setEffectsEnabled] = useState<EffectsEnabled>({
    compressor: false,
    reverb: false,
    bitcrusher: false
  });
  const [bitcrusherSettings, setBitcrusherSettings] = useState<BitcrusherSettings>({
    bitDepth: 8,
    frequencyReduction: 4
  });

  const audioElementRef = useRef<HTMLAudioElement>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const eqNodesRef = useRef<BiquadFilterNode[]>([]);
  const compressorNodeRef = useRef<DynamicsCompressorNode | null>(null);
  const convolverNodeRef = useRef<ConvolverNode | null>(null);
  const bitcrusherNodeRef = useRef<ScriptProcessorNode | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioElementRef.current) {
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.className = "w-full mb-4 rounded-lg";
      audioElementRef.current = audio;
    }
  }, []);

  const connectAudioGraph = useCallback(async () => {
    if (!audioContext || !audioBuffer) return;

    // Disconnect existing nodes
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
      } catch (e) {
        // Node might already be disconnected
      }
    }

    // Create new source
    sourceNodeRef.current = audioContext.createBufferSource();
    sourceNodeRef.current.buffer = audioBuffer;

    // Create gain node
    gainNodeRef.current = audioContext.createGain();
    gainNodeRef.current.gain.value = volume;

    // Create EQ nodes
    eqNodesRef.current = createEQFilters(audioContext);
    
    // Update EQ values
    eqNodesRef.current[0].gain.value = eqValues.bass;
    eqNodesRef.current[1].gain.value = eqValues.lowMid;
    eqNodesRef.current[2].gain.value = eqValues.mid;
    eqNodesRef.current[3].gain.value = eqValues.highMid;
    eqNodesRef.current[4].gain.value = eqValues.treble;

    // Connect EQ nodes in series
    sourceNodeRef.current.connect(eqNodesRef.current[0]);
    for (let i = 0; i < eqNodesRef.current.length - 1; i++) {
      eqNodesRef.current[i].connect(eqNodesRef.current[i + 1]);
    }

    let lastNode: AudioNode = eqNodesRef.current[eqNodesRef.current.length - 1];

    // Add compressor if enabled
    if (effectsEnabled.compressor) {
      compressorNodeRef.current = createCompressor(audioContext);
      lastNode.connect(compressorNodeRef.current);
      lastNode = compressorNodeRef.current;
    }

    // Add reverb if enabled
    if (effectsEnabled.reverb) {
      convolverNodeRef.current = await createReverb(audioContext);
      lastNode.connect(convolverNodeRef.current);
      lastNode = convolverNodeRef.current;
    }

    // Add bitcrusher if enabled
    if (effectsEnabled.bitcrusher) {
      bitcrusherNodeRef.current = createBitcrusher(audioContext, bitcrusherSettings.bitDepth, bitcrusherSettings.frequencyReduction);
      lastNode.connect(bitcrusherNodeRef.current);
      lastNode = bitcrusherNodeRef.current;
    }

    // Connect to gain and destination
    lastNode.connect(gainNodeRef.current);
    gainNodeRef.current.connect(audioContext.destination);
  }, [audioContext, audioBuffer, volume, eqValues, effectsEnabled, bitcrusherSettings]);

  const loadAudioFile = useCallback(async (file: File) => {
    try {
      // Close existing context
      if (audioContext) {
        await audioContext.close();
      }

      // Create new audio context
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);

      // Load and decode audio
      const arrayBuffer = await file.arrayBuffer();
      const buffer = await ctx.decodeAudioData(arrayBuffer);
      setAudioBuffer(buffer);

      // Set up audio element
      if (audioElementRef.current) {
        audioElementRef.current.src = URL.createObjectURL(file);
      }

      setIsPlaying(false);
    } catch (error) {
      console.error('Error loading audio file:', error);
    }
  }, [audioContext]);

  const togglePlayback = useCallback(() => {
    if (!audioContext || !audioElementRef.current) return;

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    if (audioElementRef.current.paused) {
      audioElementRef.current.play();
      setIsPlaying(true);
    } else {
      audioElementRef.current.pause();
      setIsPlaying(false);
    }
  }, [audioContext]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume;
    }
  }, []);

  const updateEQ = useCallback((band: keyof EQValues, value: number) => {
    setEQValues(prev => ({ ...prev, [band]: value }));
    
    if (eqNodesRef.current.length > 0) {
      switch (band) {
        case 'bass':
          eqNodesRef.current[0].gain.value = value;
          break;
        case 'lowMid':
          eqNodesRef.current[1].gain.value = value;
          break;
        case 'mid':
          eqNodesRef.current[2].gain.value = value;
          break;
        case 'highMid':
          eqNodesRef.current[3].gain.value = value;
          break;
        case 'treble':
          eqNodesRef.current[4].gain.value = value;
          break;
      }
    }
  }, []);

  const toggleEffect = useCallback((effect: keyof EffectsEnabled) => {
    setEffectsEnabled(prev => ({ ...prev, [effect]: !prev[effect] }));
  }, []);

  const updateBitcrusherSettings = useCallback((settings: Partial<BitcrusherSettings>) => {
    setBitcrusherSettings(prev => ({ ...prev, ...settings }));
  }, []);

  const exportAudio = useCallback(async () => {
    if (!audioContext || !audioBuffer) return;

    try {
      // Create offline context for rendering
      const offlineCtx = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );

      // Create offline processing chain
      const offlineSource = offlineCtx.createBufferSource();
      offlineSource.buffer = audioBuffer;

      const offlineGain = offlineCtx.createGain();
      offlineGain.gain.value = volume;

      // Create offline EQ
      const offlineEQ = createEQFilters(offlineCtx);
      offlineEQ[0].gain.value = eqValues.bass;
      offlineEQ[1].gain.value = eqValues.lowMid;
      offlineEQ[2].gain.value = eqValues.mid;
      offlineEQ[3].gain.value = eqValues.highMid;
      offlineEQ[4].gain.value = eqValues.treble;

      // Connect offline chain
      offlineSource.connect(offlineEQ[0]);
      for (let i = 0; i < offlineEQ.length - 1; i++) {
        offlineEQ[i].connect(offlineEQ[i + 1]);
      }

      let lastOfflineNode: AudioNode = offlineEQ[offlineEQ.length - 1];

      // Add offline effects
      if (effectsEnabled.compressor) {
        const offlineCompressor = createCompressor(offlineCtx);
        lastOfflineNode.connect(offlineCompressor);
        lastOfflineNode = offlineCompressor;
      }

      if (effectsEnabled.reverb) {
        const offlineReverb = await createReverb(offlineCtx);
        lastOfflineNode.connect(offlineReverb);
        lastOfflineNode = offlineReverb;
      }

      if (effectsEnabled.bitcrusher) {
        const offlineBitcrusher = createBitcrusher(offlineCtx, bitcrusherSettings.bitDepth, bitcrusherSettings.frequencyReduction);
        lastOfflineNode.connect(offlineBitcrusher);
        lastOfflineNode = offlineBitcrusher;
      }

      lastOfflineNode.connect(offlineGain);
      offlineGain.connect(offlineCtx.destination);

      // Render audio
      offlineSource.start();
      const renderedBuffer = await offlineCtx.startRendering();

      // Convert to WAV and download
      const wav = audioBufferToWav(renderedBuffer);
      const blob = new Blob([wav], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'mastered-audio.wav';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting audio:', error);
    }
  }, [audioContext, audioBuffer, volume, eqValues, effectsEnabled, bitcrusherSettings]);

  // Reconnect audio graph when settings change
  useEffect(() => {
    connectAudioGraph();
  }, [connectAudioGraph]);

  return {
    audioContext,
    audioBuffer,
    isPlaying,
    volume,
    eqValues,
    effectsEnabled,
    bitcrusherSettings,
    loadAudioFile,
    togglePlayback,
    setVolume,
    updateEQ,
    toggleEffect,
    updateBitcrusherSettings,
    exportAudio,
    audioElement: audioElementRef.current
  };
}
