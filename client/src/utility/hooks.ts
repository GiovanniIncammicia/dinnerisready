import { useState, useLayoutEffect, useCallback, useEffect, useRef } from "react";

export function useLocalStorage(key: string, initialValue: any) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

function useEvent(enterEvent: string, leaveEvent: string): [(instance: HTMLElement) => void, boolean, HTMLElement | undefined] {
  const [ref, setRef] = useState<HTMLElement>();
	const triggerRef = useCallback((instance: HTMLElement) => instance !== null && setRef(instance), []);
	const [triggered, setTriggered] = useState(false);

	const enter = () => setTriggered(true);
	const leave = () => setTriggered(false);

	useLayoutEffect(() => {
    if (ref) {
      ref.addEventListener(enterEvent, enter);
      ref.addEventListener(leaveEvent, leave);
    }
		return () => {
      if (ref) {
        ref.removeEventListener(enterEvent, enter);
        ref.removeEventListener(leaveEvent, leave);
      }
		};
	}, [ref, enterEvent, leaveEvent]);

	return [triggerRef, triggered, ref];
}

export const useHover = () => useEvent('mouseenter', 'mouseleave');
export const useFocus = () => useEvent('focusin', 'focusout'); // TODO: refactor ingredients tab control con useFocus o guardare grid. Se non viene usato, cancellare useFocus

export function useImperativeSetFocus () {
  const ref = useRef<HTMLInputElement>(null);
  const setFocus = useCallback(() => { if(ref.current) ref.current.focus() }, []);

  return [ref, setFocus];
};

export function useOnClickOutside(ref: any, handler: (e: MouseEvent | TouchEvent) => void ) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};