import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeToggle } from '../src/components/ui/ThemeToggle';
import * as nextThemes from 'next-themes';

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

describe('ThemeToggle Component', () => {
  it('renders correctly with dark theme', () => {
    vi.spyOn(nextThemes, 'useTheme').mockReturnValue({
      theme: 'dark',
      setTheme: vi.fn(),
      themes: ['light', 'dark'],
      systemTheme: 'light',
    });

    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders correctly with light theme', () => {
    vi.spyOn(nextThemes, 'useTheme').mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
      themes: ['light', 'dark'],
      systemTheme: 'light',
    });

    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('toggles theme when clicked', () => {
    const setThemeMock = vi.fn();
    vi.spyOn(nextThemes, 'useTheme').mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock,
      themes: ['light', 'dark'],
      systemTheme: 'light',
    });

    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button'));
    
    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });
});
