import { useEffect, useRef } from "react";

/**
 * useGameTimer - calls a callback every interval ms
 * @param {Function} callback
 * @param {number} interval
 */
export function useGameTimer(callback, interval = 60000) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!interval) return;
    const tick = () => savedCallback.current && savedCallback.current();
    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [interval]);
}
