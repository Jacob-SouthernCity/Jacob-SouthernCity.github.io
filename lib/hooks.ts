import { useActiveSectionContext } from "@/context/active-section-context";
import { useEffect, useSyncExternalStore } from "react";
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
