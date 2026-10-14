/**
 * Animation variants and easing curves adapted directly from modern-portfolio-main/variants.ts
 *
 * Timing:
 *  - duration: 1.4s (smooth, luxurious glide)
 *  - ease: cubic-bezier(0.25, 0.25, 0.25, 0.75)
 *  - offset distance: 80px
 */

export const EASE_CUBIC = 'cubic-bezier(0.25, 0.25, 0.25, 0.75)'
export const EASE_IN_OUT = 'cubic-bezier(0.42, 0, 0.58, 1)'
export const DURATION_MS = 1400
export const OFFSET_PX = 80

export const fadeIn = (direction = 'up', delay = 0) => {
  return {
    hidden: {
      y: direction === 'up' ? OFFSET_PX : direction === 'down' ? -OFFSET_PX : 0,
      x: direction === 'left' ? OFFSET_PX : direction === 'right' ? -OFFSET_PX : 0,
      opacity: 0,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        duration: DURATION_MS / 1000,
        delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  }
}
