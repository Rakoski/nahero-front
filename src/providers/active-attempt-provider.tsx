"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type PropsWithChildren,
} from "react";

/**
 * Called when the app needs the running attempt to let go of its navigation guard —
 * on logout, for instance. The attempt itself stays in progress and resumable.
 */
type ReleaseHandler = () => Promise<void>;

type ActiveAttemptContextValue = {
  registerActiveAttempt: (handler: ReleaseHandler) => () => void;
  releaseActiveAttempt: () => Promise<void>;
};

const ActiveAttemptContext = createContext<ActiveAttemptContextValue | null>(
  null,
);

export function ActiveAttemptProvider({ children }: PropsWithChildren) {
  const handlerRef = useRef<ReleaseHandler | null>(null);

  const registerActiveAttempt = useCallback((handler: ReleaseHandler) => {
    handlerRef.current = handler;
    return () => {
      if (handlerRef.current === handler) handlerRef.current = null;
    };
  }, []);

  const releaseActiveAttempt = useCallback(async () => {
    const handler = handlerRef.current;
    if (!handler) return;
    handlerRef.current = null;
    await handler();
  }, []);

  const value = useMemo(
    () => ({ registerActiveAttempt, releaseActiveAttempt }),
    [registerActiveAttempt, releaseActiveAttempt],
  );

  return (
    <ActiveAttemptContext.Provider value={value}>
      {children}
    </ActiveAttemptContext.Provider>
  );
}

export function useActiveAttempt(): ActiveAttemptContextValue {
  const context = useContext(ActiveAttemptContext);
  if (!context) {
    throw new Error(
      "useActiveAttempt must be used within an ActiveAttemptProvider",
    );
  }
  return context;
}

export function useRegisterActiveAttempt(
  enabled: boolean,
  release: ReleaseHandler,
) {
  const { registerActiveAttempt } = useActiveAttempt();
  const releaseRef = useRef(release);

  useEffect(() => {
    releaseRef.current = release;
  }, [release]);

  useEffect(() => {
    if (!enabled) return;
    return registerActiveAttempt(() => releaseRef.current());
  }, [enabled, registerActiveAttempt]);
}
