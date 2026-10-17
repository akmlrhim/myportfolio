import { h } from 'vue'

export const GridIcon = () =>
  h('svg', { viewBox: '0 0 16 16', width: 14, height: 14, 'aria-hidden': 'true', style: { maxWidth: 'none' } }, [
    h('rect', { x: 1.5, y: 1.5, width: 5.5, height: 5.5, rx: 1, fill: 'currentColor' }),
    h('rect', { x: 9, y: 1.5, width: 5.5, height: 5.5, rx: 1, fill: 'currentColor' }),
    h('rect', { x: 1.5, y: 9, width: 5.5, height: 5.5, rx: 1, fill: 'currentColor' }),
    h('rect', { x: 9, y: 9, width: 5.5, height: 5.5, rx: 1, fill: 'currentColor' }),
  ])

export const CubeIcon = () =>
  h('svg', { viewBox: '0 0 16 16', width: 14, height: 14, 'aria-hidden': 'true', style: { maxWidth: 'none' } }, [
    h('path', {
      d: 'M8 1.2 14.2 4.6v6.8L8 14.8 1.8 11.4V4.6Z',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 1.5,
      'stroke-linejoin': 'round',
    }),
    h('path', {
      d: 'M1.8 4.6 8 8l6.2-3.4M8 8v6.8',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 1.5,
      'stroke-linejoin': 'round',
    }),
  ])
