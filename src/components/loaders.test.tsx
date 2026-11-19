import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Loader } from './loaders';

describe('Loader', () => {
  it("keeps each instance's animated mask independent", () => {
    const { container } = render(
      <>
        <Loader />
        <Loader />
      </>,
    );

    const masks = [...container.querySelectorAll('mask')];
    expect(masks).toHaveLength(2);
    expect(masks[0].id).not.toBe(masks[1].id);
    for (const mask of masks) {
      expect(mask.closest('svg')?.querySelector('g')?.getAttribute('mask')).toBe(
        `url(#${mask.id})`,
      );
    }
  });
  it('retains the original aspect ratio and exposes a single loading announcement', () => {
    render(<Loader label="Preparing your collection" size={300} />);
    const status = screen.getByRole('status', {
      name: 'Preparing your collection',
    });

    const svg = status.querySelector('svg')!;
    expect(svg).toHaveAttribute('width', '300');
    expect(svg).toHaveAttribute('height', '356');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
  it('accepts the original timing and color options', () => {
    const { container } = render(
      <Loader
        backgroundColor="violet"
        foregroundColor="navy"
        startScale={0.4}
        scaleDuration={1800}
        waveDuration={11000}
      />,
    );

    const svg = container.querySelector('svg')!;
    expect(svg.style.color).toBe('violet');
    expect(svg.style.getPropertyValue('--dg-loader-start-scale')).toBe('0.4');
    expect(svg.style.getPropertyValue('--dg-loader-scale-duration')).toBe('1800ms');
    expect(svg.style.getPropertyValue('--dg-wave-duration')).toBe('11000ms');
    expect(container.querySelector('g polygon')).toHaveAttribute('fill', 'navy');
  });
  it('keeps the duration alias while preferring the original waveDuration option', () => {
    const { container, rerender } = render(<Loader duration={9000} />);
    const duration = () =>
      container.querySelector('svg')!.style.getPropertyValue('--dg-wave-duration');

    expect(duration()).toBe('9000ms');
    rerender(<Loader duration={9000} waveDuration={7000} />);
    expect(duration()).toBe('7000ms');
  });
});
