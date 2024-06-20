import { createContext, useContext, useState } from "react";

export const OnboardingStateContext = createContext();

export function OnboardingProvider({ children }) {
  const [state, setState] = useState({});

  return (
    <OnboardingStateContext.Provider value={[state, setState]}>
      {children}
    </OnboardingStateContext.Provider>
  );
}

export function useOnboardingState() {
  const context = useContext(OnboardingStateContext);
  // console.log(context);
  if (!context) {
    throw new Error(
      "useOnboardingState must be used within the OnboardingProvider"
    );
  }
  return context;
}
