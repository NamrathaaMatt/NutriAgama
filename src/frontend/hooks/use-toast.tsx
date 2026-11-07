"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

type ToastKind = "success" | "error";

type ToastContextType = {
  showToast: (message: string, kind?: ToastKind) => void;
};
const ToastContext = createContext<ToastContextType | null>(null);

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [kind, setKind] = useState<ToastKind>("success");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string, toastKind: ToastKind = "success") => {
  if (timeoutRef.current) clearTimeout(timeoutRef.current);
  if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

  setMessage(msg);
  setKind(toastKind);
  setVisible(true);

    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      hideTimeoutRef.current = setTimeout(() => setMessage(null), 300);
    }, 2200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {message && (
        <div className={`toastWrap ${visible ? "toastWrapVisible" : ""}`}>
          <div className={`toast ${kind === "error" ? "toastError" : ""}`}>
  <span className="toastIcon" aria-hidden="true">
    {kind === "error" ? "!" : <CheckIcon />}
  </span>
  <span className="toastMessage">{message}</span>
</div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}