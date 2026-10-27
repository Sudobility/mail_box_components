import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  AnimatedSection,
  FadeInUp,
  FadeInScale,
  FloatingElement,
} from '../ui/animated-section';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
// Vitest 4: a mock invoked with `new` must be given a class implementation
// (not mockReturnValue, nor an arrow function).
mockIntersectionObserver.mockImplementation(
  class {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
);

beforeEach(() => {
  vi.clearAllMocks();
  // @ts-ignore
  window.IntersectionObserver = mockIntersectionObserver;
});

describe('AnimatedSection Component', () => {
  it('renders children', () => {
    render(
      <AnimatedSection>
        <div>Animated content</div>
      </AnimatedSection>
    );

    expect(screen.getByText('Animated content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <AnimatedSection className='custom-animation'>
        <div>Content</div>
      </AnimatedSection>
    );

    const content = screen.getByText('Content');
    expect(content.parentElement).toHaveClass('custom-animation');
  });

  it('renders with different animation types', () => {
    const { rerender } = render(
      <AnimatedSection animation='fade-in-up'>
        <div>Fade up content</div>
      </AnimatedSection>
    );
    expect(screen.getByText('Fade up content')).toBeInTheDocument();

    rerender(
      <AnimatedSection animation='fade-in-scale'>
        <div>Scale content</div>
      </AnimatedSection>
    );
    expect(screen.getByText('Scale content')).toBeInTheDocument();

    rerender(
      <AnimatedSection animation='float'>
        <div>Float content</div>
      </AnimatedSection>
    );
    expect(screen.getByText('Float content')).toBeInTheDocument();
  });

  it('handles no animation', () => {
    render(
      <AnimatedSection animation='none'>
        <div>No animation</div>
      </AnimatedSection>
    );

    expect(screen.getByText('No animation')).toBeInTheDocument();
  });

  it('sets up IntersectionObserver when available', () => {
    render(
      <AnimatedSection>
        <div>Observed content</div>
      </AnimatedSection>
    );

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.1 }
    );
  });
});

describe('Utility Animation Components', () => {
  describe('FadeInUp', () => {
    it('renders with fade-in-up animation', () => {
      render(
        <FadeInUp>
          <div>Fade up content</div>
        </FadeInUp>
      );

      expect(screen.getByText('Fade up content')).toBeInTheDocument();
    });

    it('accepts delay prop', () => {
      render(
        <FadeInUp delay={200}>
          <div>Delayed content</div>
        </FadeInUp>
      );

      expect(screen.getByText('Delayed content')).toBeInTheDocument();
    });
  });

  describe('FadeInScale', () => {
    it('renders with fade-in-scale animation', () => {
      render(
        <FadeInScale>
          <div>Scale content</div>
        </FadeInScale>
      );

      expect(screen.getByText('Scale content')).toBeInTheDocument();
    });
  });

  describe('FloatingElement', () => {
    it('renders with float animation', () => {
      render(
        <FloatingElement>
          <div>Floating content</div>
        </FloatingElement>
      );

      expect(screen.getByText('Floating content')).toBeInTheDocument();
    });
  });
});
