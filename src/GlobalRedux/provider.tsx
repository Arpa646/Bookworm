"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { ReactNode } from "react"; // Import ReactNode for type

interface ProvidersProps {
  children: ReactNode; // Type the children prop
}

export function Providerss({ children }: ProvidersProps) {
  return <Provider store={store}>{children}</Provider>;
}
