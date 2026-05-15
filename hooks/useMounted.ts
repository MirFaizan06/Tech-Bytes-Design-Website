'use client';

import { useEffect, useState } from 'react';

/** Returns true only after the component has mounted on the client.
 *  Use to defer any rendering that depends on browser-only state
 *  (localStorage, window, etc.) so server and client HTML match exactly. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
