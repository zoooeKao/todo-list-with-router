// @ts-check
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { LayoutContextProvider, ThemeContextProvider } from './model/context/provider';
import { router } from './router';
import './styles/base.scss';
import './styles/reset.scss';
import './styles/variable.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <LayoutContextProvider>
        <RouterProvider router={router} />
      </LayoutContextProvider>
    </ThemeContextProvider>
  </React.StrictMode>,
);
