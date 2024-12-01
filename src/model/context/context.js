// @ts-check
import { createContext, useContext } from 'react';

// themeState
/**
 * @typedef {{themeState: import('./context-state').ThemeState; setThemeState:React.Dispatch<React.SetStateAction<import('./context-state').ThemeState>>;}} ThemeContext
 */

/**
 * @type {React.Context<ThemeContext | null>}
 */
export const ThemeStateContext = createContext(null);

export const useThemeState = () => {
  const theme = useContext(ThemeStateContext);

  if (!theme) throw new Error('Theme state does not has a provider.');

  return theme;
};

// layoutState
/**
 * @typedef {{layoutState: import('./context-state').LayoutState; setLayoutState:React.Dispatch<React.SetStateAction<import('./context-state').LayoutState>>;}} LayoutContext
 */

/**
 * @type {React.Context<LayoutContext | null>}
 */
export const LayoutStateContext = createContext(null);

export const useLayoutState = () => {
  const layout = useContext(LayoutStateContext);

  if (!layout) throw new Error('Layout state does not has a provider.');

  return layout;
};
