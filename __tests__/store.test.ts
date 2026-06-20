import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../src/lib/store';

describe('Zustand Store Tests', () => {
  beforeEach(() => {
    // Reset store before each test
    useStore.getState().reset();
  });

  it('should initialize with 100 rockHealth', () => {
    const state = useStore.getState();
    expect(state.wellness.rockHealth).toBe(100);
    expect(state.wellness.mossLevel).toBe(0);
  });

  it('should update wellness and append to history', () => {
    useStore.getState().updateWellness({ rockHealth: 85 });
    
    const state = useStore.getState();
    expect(state.wellness.rockHealth).toBe(85);
    expect(state.wellness.history.length).toBeGreaterThan(0);
    expect(state.wellness.history[0].hp).toBe(85);
  });

  it('should add a chat message', () => {
    useStore.getState().addChatMessage({ role: 'user', text: 'Hello Pebbl!' });
    
    const state = useStore.getState();
    expect(state.chatHistory.length).toBe(1);
    expect(state.chatHistory[0].text).toBe('Hello Pebbl!');
  });
});
