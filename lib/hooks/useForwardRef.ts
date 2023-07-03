import { ForwardedRef, useEffect, useRef } from 'react';

/**
 * A forwarded ref could be a function or a ref object, which makes it annoying to use. This ensures
 * a consistent interface to make use easier.
 * @param ref The forwarded ref that is passed into the component that is using this.
 */
export const useForwardRef = <T>(ref: ForwardedRef<T>, initialValue: any = null) => {
  const targetRef = useRef<T>(initialValue);

  useEffect(() => {
    if (!ref) return;

    if (typeof ref === 'function') {
      ref(targetRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      ref.current = targetRef.current;
    }
  }, [ref]);

  return targetRef;
};
