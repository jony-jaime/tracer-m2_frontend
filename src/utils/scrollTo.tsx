import { animateScroll } from "./animateScroll";

const logError = (): void => console.error(`Invalid element, are you sure you've provided element id or react ref?`);

const getElementPosition = (element: HTMLElement): number => element.offsetTop;

interface ScrollToParams {
  id: string;
  duration?: number;
}

export const scrollTo = ({ id, duration = 1500 }: ScrollToParams): void => {
  const initialPosition = window.scrollY;
  const element = id ? document.getElementById(id) : null;

  if (!element) {
    logError();
    return;
  }

  animateScroll({
    targetPosition: getElementPosition(element as HTMLElement) - 50,
    initialPosition,
    duration,
  });
};
