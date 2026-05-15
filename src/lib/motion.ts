import { animate, stagger } from 'animejs';

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function animatePanelRefresh(target: Element | null) {
  if (!target || prefersReducedMotion()) {
    return;
  }

  return animate(target, {
    opacity: [0.72, 1],
    translateY: [8, 0],
    duration: 320,
    ease: 'outQuad',
  });
}

export function animateMarkers(targets: Element[] | NodeListOf<Element>) {
  if (!targets.length || prefersReducedMotion()) {
    return;
  }

  return animate(targets, {
    opacity: [0, 1],
    scale: [0.72, 1],
    translateY: [6, 0],
    duration: 420,
    delay: stagger(18),
    ease: 'outBack(1.6)',
  });
}

export function animateListItems(targets: Element[] | NodeListOf<Element>) {
  if (!targets.length || prefersReducedMotion()) {
    return;
  }

  return animate(targets, {
    opacity: [0, 1],
    translateY: [8, 0],
    duration: 300,
    delay: stagger(35),
    ease: 'outQuad',
  });
}

export function animateCommonTonePulse(targets: Element[] | NodeListOf<Element>) {
  if (!targets.length || prefersReducedMotion()) {
    return;
  }

  return animate(targets, {
    backgroundColor: ['rgba(216, 177, 75, 0.26)', 'rgba(216, 177, 75, 0)'],
    duration: 720,
    delay: stagger(70),
    ease: 'outQuad',
  });
}
