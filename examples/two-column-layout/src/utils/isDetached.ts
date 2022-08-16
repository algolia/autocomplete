export function isDetached() {
  return window.matchMedia(
    getComputedStyle(document.documentElement).getPropertyValue(
      '--aa-detached-media-query'
    )
  ).matches;
}
