import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ExamNews from '../src/components/news/ExamNews';

// Mock the Zustand store
vi.mock('../src/lib/store', () => ({
  useStore: vi.fn(() => ({
    profile: { targetExams: ['JEE', 'NEET'] },
  })),
}));

// Mock global fetch
global.fetch = vi.fn();

describe('ExamNews Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders the news component and loading state initially', () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [] }),
    });

    render(<ExamNews />);
    
    expect(screen.getByText('Exam Radar')).toBeInTheDocument();
    // It should fetch and render without crashing
  });
});
