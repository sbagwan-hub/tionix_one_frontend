import { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';

/**
 * A hook that debouncing a value using Lodash.
 * @param value The value to debounce.
 * @param delay The delay in milliseconds (default: 500ms).
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  const debouncedSetRef = useRef(
    debounce((newValue: T) => {
      setDebouncedValue(newValue);
    }, delay),
  );

  useEffect(() => {
    debouncedSetRef.current = debounce((newValue: T) => {
      setDebouncedValue(newValue);
    }, delay);

    return () => {
      debouncedSetRef.current.cancel();
    };
  }, [delay]);

  useEffect(() => {
    debouncedSetRef.current(value);
  }, [value]);

  return debouncedValue;
}
