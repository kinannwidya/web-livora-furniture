// src/hooks/useBlocker.ts
import { useEffect, useContext } from "react";
import { UNSAFE_NavigationContext } from "react-router-dom";

export function useBlocker(blocker: (tx: any) => void, when = true) {
  const { navigator }: any = useContext(UNSAFE_NavigationContext);

  useEffect(() => {
    if (!when) return;

    const push = navigator.push;
    navigator.push = (...args: any[]) => {
      blocker({ retry: () => push.apply(navigator, args) });
    };

    return () => {
      navigator.push = push;
    };
  }, [navigator, blocker, when]);
}