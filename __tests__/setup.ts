import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Web Audio API
class AudioContextMock {
  destination = {};
  createOscillator() {
    return {
      type: 'sine',
      frequency: { value: 0 },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }
  createGain() {
    return {
      gain: { value: 0, setTargetAtTime: vi.fn() },
      connect: vi.fn(),
    };
  }
}
window.AudioContext = AudioContextMock as any;
window.webkitAudioContext = AudioContextMock as any;

// Mock Web Speech API
class SpeechRecognitionMock {
  continuous = false;
  interimResults = false;
  start = vi.fn();
  stop = vi.fn();
}
window.SpeechRecognition = SpeechRecognitionMock as any;
window.webkitSpeechRecognition = SpeechRecognitionMock as any;
