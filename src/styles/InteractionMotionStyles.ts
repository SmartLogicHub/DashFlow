export const INTERACTION_MOTION_STYLES = `
/* v0.4.4 Interaction & Flexible Dashboard
 * Presentation-only motion and responsive card behavior.
 * Keep business data and layout persistence in their existing owners.
 */
.dashflow-view-container {
  --df-motion-fast: 120ms;
  --df-motion-normal: 220ms;
  --df-motion-slow: 360ms;
  --df-ease-standard: cubic-bezier(.2, .8, .2, 1);
  --df-ease-spring: cubic-bezier(.16, 1, .3, 1);
  --df-card-lift: -2px;
}

.dashflow-widget {
  container-type: inline-size;
  transition:
    transform var(--df-motion-normal) var(--df-ease-spring),
    box-shadow var(--df-motion-normal) var(--df-ease-standard),
    border-color var(--df-motion-fast) var(--df-ease-standard),
    opacity var(--df-motion-fast) var(--df-ease-standard);
}

.dashflow-grid:not(.is-editing) > .dashflow-widget {
  animation: df-card-enter var(--df-motion-slow) var(--df-ease-spring) both;
}

.dashflow-grid:not(.is-editing) > .dashflow-widget:nth-child(2) { animation-delay: 24ms; }
.dashflow-grid:not(.is-editing) > .dashflow-widget:nth-child(3) { animation-delay: 48ms; }
.dashflow-grid:not(.is-editing) > .dashflow-widget:nth-child(4) { animation-delay: 72ms; }
.dashflow-grid:not(.is-editing) > .dashflow-widget:nth-child(5) { animation-delay: 96ms; }
.dashflow-grid:not(.is-editing) > .dashflow-widget:nth-child(6) { animation-delay: 120ms; }
.dashflow-grid:not(.is-editing) > .dashflow-widget:nth-child(n + 7) { animation-delay: 144ms; }

@keyframes df-card-enter {
  from {
    opacity: 0;
    transform: translateY(8px) scale(.992);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (hover: hover) and (pointer: fine) {
  .dashflow-grid:not(.is-editing) > .dashflow-widget:hover {
    transform: translateY(var(--df-card-lift));
  }
}

/* Edit mode should feel tangible without making the whole canvas noisy. */
.dashflow-grid.is-editing > .dashflow-widget {
  transition:
    transform var(--df-motion-fast) var(--df-ease-standard),
    box-shadow var(--df-motion-fast) var(--df-ease-standard),
    border-color var(--df-motion-fast) var(--df-ease-standard),
    grid-column var(--df-motion-fast) var(--df-ease-standard),
    grid-row var(--df-motion-fast) var(--df-ease-standard);
}

.dashflow-grid.is-editing > .dashflow-widget.is-dragging {
  z-index: 20;
  transform: scale(1.015);
  opacity: .94;
  transition: none;
}

.dashflow-widget-controls button,
.dashflow-resize-handle {
  transition:
    transform var(--df-motion-fast) var(--df-ease-standard),
    opacity var(--df-motion-fast) var(--df-ease-standard),
    background-color var(--df-motion-fast) var(--df-ease-standard),
    border-color var(--df-motion-fast) var(--df-ease-standard);
}

@media (hover: hover) and (pointer: fine) {
  .dashflow-widget-controls button:hover {
    transform: translateY(-1px);
  }

  .dashflow-resize-handle:hover {
    transform: scale(1.08);
  }
}

/* Numeric feedback: short, transform-only and safe for frequent dashboard updates. */
.dashflow-pulse strong,
.dashflow-stat strong,
.dashflow-progress-ring strong,
.dashflow-progress-meta,
.dashflow-project-stat strong,
.dashflow-countdown strong {
  font-variant-numeric: tabular-nums;
  animation: df-number-pop var(--df-motion-normal) var(--df-ease-spring) both;
}

@keyframes df-number-pop {
  from {
    opacity: .55;
    transform: translateY(4px) scale(.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Countdown is already instance-configurable. v0.4.4 makes it read well from
 * compact to expanded card sizes instead of assuming one fixed footprint. */
.dashflow-widget:has(.dashflow-countdown) .dashflow-widget-body {
  min-height: 0;
}

.dashflow-countdown {
  height: 100%;
  min-height: 0;
  display: grid;
  align-content: center;
  justify-items: start;
  gap: 2px;
}

.dashflow-countdown > span {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dashflow-countdown > strong {
  line-height: .92;
  font-size: clamp(38px, 18cqi, 82px)!important;
  letter-spacing: -.055em;
}

.dashflow-countdown > small {
  letter-spacing: .12em;
}

@container (max-width: 250px) {
  .dashflow-countdown {
    gap: 0;
  }

  .dashflow-countdown > strong {
    font-size: clamp(32px, 22cqi, 52px)!important;
  }

  .dashflow-countdown > small {
    font-size: 9px!important;
  }
}

/* Responsive information density for resized cards. */
@container (max-width: 280px) {
  .dashflow-widget-kicker > span,
  .dashflow-project-stat > span,
  .dashflow-progress-meta {
    display: none;
  }

  .dashflow-widget-body {
    --df-compact-card: 1;
  }
}

@container (min-width: 520px) {
  .dashflow-widget-body {
    --df-expanded-card: 1;
  }
}

/* Keep touch layouts stable: no hover lift and no accidental transform cost. */
@media (max-width: 900px) {
  .dashflow-widget {
    transform: none!important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dashflow-view-container {
    --df-motion-fast: 0ms;
    --df-motion-normal: 0ms;
    --df-motion-slow: 0ms;
  }

  .dashflow-grid > .dashflow-widget,
  .dashflow-pulse strong,
  .dashflow-stat strong,
  .dashflow-progress-ring strong,
  .dashflow-progress-meta,
  .dashflow-project-stat strong,
  .dashflow-countdown strong {
    animation: none!important;
    transition-duration: 0ms!important;
  }

  .dashflow-grid:not(.is-editing) > .dashflow-widget:hover,
  .dashflow-grid.is-editing > .dashflow-widget.is-dragging {
    transform: none!important;
  }
}
`;
