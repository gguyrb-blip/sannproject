"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import BookingModal from "./BookingModal";

type Ctx = {
  open: (preferredUnit?: string) => void;
  close: () => void;
  isOpen: boolean;
  preferredUnit: string | undefined;
};

const BookingModalCtx = createContext<Ctx | null>(null);

export function BookingModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [preferredUnit, setPreferredUnit] = useState<string | undefined>();

  const open = useCallback((unit?: string) => {
    setPreferredUnit(unit);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ open, close, isOpen, preferredUnit }),
    [open, close, isOpen, preferredUnit],
  );

  return (
    <BookingModalCtx.Provider value={value}>
      {children}
      <BookingModal />
    </BookingModalCtx.Provider>
  );
}

export function useBookingModal() {
  const ctx = useContext(BookingModalCtx);
  if (!ctx) throw new Error("useBookingModal must be used inside provider");
  return ctx;
}
