const pow = Math.pow;

// Easing function
function easeOutQuart(x: number): number {
  return 1 - pow(1 - x, 4);
}

interface AnimateScrollParams {
  targetPosition: number;
  initialPosition: number;
  duration: number;
}

export function animateScroll({ targetPosition, initialPosition, duration }: AnimateScrollParams): void {
  let start: number | undefined;
  let position: number;
  let animationFrame: number;

  const requestAnimationFrame = window.requestAnimationFrame;
  const cancelAnimationFrame = window.cancelAnimationFrame;

  const maxAvailableScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const amountOfPixelsToScroll = initialPosition - targetPosition;

  function step(timestamp: number): void {
    if (start === undefined) {
      start = timestamp;
    }

    const elapsed = timestamp - start;
    const relativeProgress = elapsed / duration;
    const easedProgress = easeOutQuart(relativeProgress);
    position = initialPosition - amountOfPixelsToScroll * Math.min(easedProgress, 1);

    window.scrollTo(0, position);

    if (initialPosition !== maxAvailableScroll && window.scrollY === maxAvailableScroll) {
      cancelAnimationFrame(animationFrame);
      return;
    }

    if (elapsed < duration) {
      animationFrame = requestAnimationFrame(step);
    }
  }

  animationFrame = requestAnimationFrame(step);
}
