// Web Audio API utility functions for audio processing

export function createEQFilters(ctx: AudioContext): BiquadFilterNode[] {
  const bands = [
    { freq: 60, type: 'lowshelf' as BiquadFilterType },
    { freq: 250, type: 'peaking' as BiquadFilterType },
    { freq: 1000, type: 'peaking' as BiquadFilterType },
    { freq: 4000, type: 'peaking' as BiquadFilterType },
    { freq: 10000, type: 'highshelf' as BiquadFilterType },
  ];
  
  return bands.map(band => {
    const filter = ctx.createBiquadFilter();
    filter.type = band.type;
    filter.frequency.value = band.freq;
    filter.Q.value = 1;
    filter.gain.value = 0;
    return filter;
  });
}

export function createCompressor(ctx: AudioContext): DynamicsCompressorNode {
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-24, ctx.currentTime);
  compressor.knee.setValueAtTime(30, ctx.currentTime);
  compressor.ratio.setValueAtTime(12, ctx.currentTime);
  compressor.attack.setValueAtTime(0.003, ctx.currentTime);
  compressor.release.setValueAtTime(0.25, ctx.currentTime);
  return compressor;
}

export async function createReverb(ctx: AudioContext): Promise<ConvolverNode> {
  const convolver = ctx.createConvolver();
  
  // Create impulse response for reverb
  const irBuffer = ctx.createBuffer(2, ctx.sampleRate * 3, ctx.sampleRate);
  for (let channel = 0; channel < irBuffer.numberOfChannels; channel++) {
    const channelData = irBuffer.getChannelData(channel);
    for (let i = 0; i < channelData.length; i++) {
      channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / channelData.length, 2);
    }
  }
  
  convolver.buffer = irBuffer;
  return convolver;
}

export function createBitcrusher(ctx: AudioContext, bitDepth = 8, frequencyReduction = 4): ScriptProcessorNode {
  const node = ctx.createScriptProcessor(4096, 1, 1);
  let phaser = 0;
  let lastSampleValue = 0;
  
  node.onaudioprocess = function (e) {
    const input = e.inputBuffer.getChannelData(0);
    const output = e.outputBuffer.getChannelData(0);
    
    for (let i = 0; i < input.length; i++) {
      phaser += frequencyReduction;
      if (phaser >= 1.0) {
        phaser -= 1.0;
        // Quantize sample to bit depth
        const step = Math.pow(0.5, bitDepth);
        lastSampleValue = step * Math.floor(input[i] / step + 0.5);
      }
      output[i] = lastSampleValue;
    }
  };
  
  return node;
}

export function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const length = buffer.length;
  const channels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const arrayBuffer = new ArrayBuffer(44 + length * channels * 2);
  const view = new DataView(arrayBuffer);
  
  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * channels * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channels * 2, true);
  view.setUint16(32, channels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length * channels * 2, true);
  
  // PCM data
  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < channels; channel++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
  }
  
  return arrayBuffer;
}
