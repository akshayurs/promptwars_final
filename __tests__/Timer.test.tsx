import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Timer from '../src/components/pomodoro/Timer';

describe('Timer Component', () => {
  it('renders the pomodoro timer with default 25:00', () => {
    render(<Timer />);
    
    // Verify the initial time is displayed
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('00')).toBeInTheDocument();
    
    // Verify the control buttons exist
    expect(screen.getByRole('button', { name: /Start/i })).toBeInTheDocument();
  });
});
