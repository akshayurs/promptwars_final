import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from '../src/components/ui/Card';

describe('Card Component', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <Card>
        <div>Test Content</div>
      </Card>
    );
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('applies the correct default variant styles', () => {
    const { container } = render(<Card>Content</Card>);
    const cardDiv = container.firstChild as HTMLElement;
    expect(cardDiv).toHaveClass('bg-white/10');
  });

  it('applies the primary variant styles when specified', () => {
    const { container } = render(<Card variant="primary">Content</Card>);
    const cardDiv = container.firstChild as HTMLElement;
    expect(cardDiv).toHaveClass('bg-primary/20');
  });
});
