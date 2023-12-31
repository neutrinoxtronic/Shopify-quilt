import type {MutableRefObject} from 'react';
import {useRef, useState} from 'react';

export function useLazyRef<T>(getValue: () => T): MutableRefObject<T> {
  const [value] = useState<T>(getValue);
  const ref = useRef<T>(value);

  return ref as MutableRefObject<T>;
}
