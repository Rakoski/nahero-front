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

type AbandonHandler = () => Promise<void>;

type ActiveAttemptContextValue = {
  registerActiveAttempt: (handler: AbandonHandler) => () => void;
  abandonActiveAttempt: () => Promise<void>;
};

const ActiveAttemptContext = createContext<ActiveAttemptContextValue | null>(
  null,
);

export function ActiveAttemptProvider({ children }: PropsWithChildren) {
  const handlerRef = useRef<AbandonHandler | null>(null);

  const registerActiveAttempt = useCallback((handler: AbandonHandler) => {
    handlerRef.current = handler;
    return () => {
      if (handlerRef.current === handler) handlerRef.current = null;
    };
  }, []);

  const abandonActiveAttempt = useCallback(async () => {
    const handler = handlerRef.current;
    if (!handler) return;
    handlerRef.current = null;
    await handler();
  }, []);

  const value = useMemo(
    () => ({ registerActiveAttempt, abandonActiveAttempt }),
    [registerActiveAttempt, abandonActiveAttempt],
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
  abandon: AbandonHandler,
) {
  const { registerActiveAttempt } = useActiveAttempt();
  const abandonRef = useRef(abandon);

  useEffect(() => {
    abandonRef.current = abandon;
  }, [abandon]);

  useEffect(() => {
    if (!enabled) return;
    return registerActiveAttempt(() => abandonRef.current());
  }, [enabled, registerActiveAttempt]);
}
