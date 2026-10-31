import { useActiveSectionContext } from "@/context/active-section-context";
import { useCallback, useEffect, useSyncExternalStore, type RefObject } from "react";
import { useInView } from "react-intersection-observer";
import type { SectionName } from "./types";

export function useSectionInView(sectionName: SectionName) {
  const { ref, inView } = useInView({
    rootMargin: "-50% 0px -50% 0px",
  });
  const { setActiveSection, timeOfLastClick } = useActiveSectionContext();

  useEffect(() => {
    if (inView && Date.now() - timeOfLastClick > 1000) {
      setActiveSection(sectionName);
    }
  }, [inView, setActiveSection, timeOfLastClick, sectionName]);

  return {
    ref,
  };
}

const subscribeToNothing = () => () => {};

const getCurrentMonthIndex = () => {
  const now = new Date();
  return now.getFullYear() * 12 + now.getMonth();
};

export function useCurrentMonthIndex() {
  return useSyncExternalStore(subscribeToNothing, getCurrentMonthIndex, () => null);
}

export function useIsHydrated() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  );
}

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

const measureWidth = (element: HTMLElement) => element.getBoundingClientRect().width;

export function useElementMeasure(
  ref: RefObject<HTMLElement | null>,
  measure: (element: HTMLElement) => number
) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const element = ref.current;
      if (!element) return () => {};
      const observer = new ResizeObserver(onChange);
      observer.observe(element);
      return () => observer.disconnect();
    },
    [ref]
  );

  return useSyncExternalStore(
    subscribe,
    () => (ref.current ? Math.round(measure(ref.current)) : 0),
    () => 0
  );
}

export function useElementWidth(ref: RefObject<HTMLElement | null>) {
  return useElementMeasure(ref, measureWidth);
}
