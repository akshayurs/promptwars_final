import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Companion from '../src/components/ui/Companion';

// Mock the Zustand store so we can manipulate the pet's HP
vi.mock('../src/lib/store', () => ({
  useStore: vi.fn(() => ({
    wellness: { rockHealth: 100, mossLevel: 1 },
  })),
}));

describe('Companion Component', () => {
  it('renders the pet rock companion successfully', () => {
    render(<Companion />);
    // Verify it renders the image
    const rockImages = screen.getAllByRole('img');
    expect(rockImages.length).toBeGreaterThan(0);
    // Verify HP is displayed (since health is 100)
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('HP')).toBeInTheDocument();
  });
});
