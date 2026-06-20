import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from '../src/components/ui/Input';

describe('Input Component', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('applies default glass-input class', () => {
    render(<Input data-testid="test-input" />);
    const input = screen.getByTestId('test-input');
    expect(input).toHaveClass('glass-input');
  });

  it('passes additional props to the input element', () => {
    render(<Input data-testid="test-input" type="password" required />);
    const input = screen.getByTestId('test-input');
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toBeRequired();
  });
});
