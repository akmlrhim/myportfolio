import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Reveal-on-scroll composable backed by IntersectionObserver + CSS classes.
 * Replaces the motion-v dependency for above-the-fold critical components,
 * keeping the animation library out of the initial bundle.
 *
 * Returns `el` (template ref) and `visible` (ref<boolean>).
 */
export function useReveal({ rootMargin = '-40px' } = {}) {
  const el = ref(null)
  const visible = ref(false)
  let observer = null

  function resolveDOM(target) {
    if (!target) return null
    if (target instanceof Element) return target
    const dom = target.$el
    return dom instanceof Element ? dom : null
  }

  onMounted(() => {
    const target = resolveDOM(el.value)

    if (!target || typeof IntersectionObserver === 'undefined') {
      visible.value = true
      return
    }

    // Already in the viewport on mount → show without animating (faster LCP).
    const rect = target.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      visible.value = true
      return
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        visible.value = true
        observer.disconnect()
        observer = null
      },
      { rootMargin },
    )
    observer.observe(target)
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })

  return { el, visible }
}
