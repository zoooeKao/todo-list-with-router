// @ts-check
import { useState } from 'react';
import { LayoutStateContext, ThemeStateContext } from './context';

/**
 * @type {React.FC<{ children: React.ReactNode }>}
 */
export const ThemeContextProvider = ({ children }) => {
  const [themeState, setThemeState] = useState(/** @type {import('./context-state').ThemeState} */ ('white'));

  return <ThemeStateContext.Provider value={{ themeState, setThemeState }}>{children}</ThemeStateContext.Provider>;
};

/**
 * @type {React.FC<{children: React.ReactNode}>}
 */
export const LayoutContextProvider = ({ children }) => {
  const [layoutState, setLayoutState] = useState(/** @type {import('./context-state').LayoutState} */ ('row'));

  return <LayoutStateContext.Provider value={{ layoutState, setLayoutState }}>{children}</LayoutStateContext.Provider>;
};
