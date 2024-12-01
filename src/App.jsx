// @ts-check
import { Outlet } from 'react-router-dom';

/**
 * @type {React.FC}
 */
export const App = () => {
  return (
    <>
      <body>
        <Outlet />
      </body>
    </>
  );
};
