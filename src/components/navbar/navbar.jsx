// @ts-check
import UilGrid from '@iconscout/react-unicons/icons/uil-grid';
import UilHome from '@iconscout/react-unicons/icons/uil-home';
import UilWindowMaximize from '@iconscout/react-unicons/icons/uil-window-maximize';
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';
import { useLayoutState, useThemeState } from '../../model/context/context';
import { logout } from '../../service/logout';
import './navbar.scss';

/**
 * @type {React.FC}
 */
export const Navbar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Code review:
  // useLoaderData 用 custom hook 包起來
  const loaderData = /** @type {null | import('../../page/todo-pagination').ReturnTodoLoader} */ (useLoaderData());
  const profile = loaderData ? loaderData.profile : null;

  const { themeState, setThemeState } = useThemeState();
  const { layoutState, setLayoutState } = useLayoutState();

  // Code review:
  // 透過 new URLSearchParams 會自動處理 encode 和 decode
  const query = new URLSearchParams({ redirect: searchParams.toString() });

  return (
    <nav className="navbar">
      <div className="navbar__container navbar__layout">
        <div className="navbar__left">
          <div>
            <UilHome size="50" />
          </div>
          <div>
            <span className="navbar__greeting">Hello {profile && `${profile.username}`}</span>
          </div>
        </div>
        <div className="navbar__right">
          <div className="navbar__icon" onClick={() => setLayoutState(layoutState === 'row' ? 'card' : 'row')}>
            {profile && (layoutState === 'row' ? <UilGrid size="30" /> : <UilWindowMaximize size="30" />)}
          </div>

          <div className="navbar__icon" onClick={() => setThemeState(themeState === 'white' ? 'aquamarine' : 'white')}>
            <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" id="palette">
              <path
                fill={themeState === 'white' ? '#15A673' : ''}
                d="M7.42,15.54a1,1,0,0,0,0,1.41,1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.41A1,1,0,0,0,7.42,15.54Zm0-8.49a1,1,0,0,0,0,1.41,1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.41A1,1,0,0,0,7.42,7.05Zm4.95,10a1,1,0,1,0,1,1A1,1,0,0,0,12.37,17Zm-6-6a1,1,0,1,0,1,1A1,1,0,0,0,6.37,11Zm6-6a1,1,0,1,0,1,1A1,1,0,0,0,12.37,5Zm3.54,2.05a1,1,0,1,0,1.41,0A1,1,0,0,0,15.91,7.05Zm6.3,0a11,11,0,1,0-7.85,15.74,3.87,3.87,0,0,0,2.5-1.65A4.2,4.2,0,0,0,17.47,18a5.65,5.65,0,0,1-.1-1,5,5,0,0,1,3-4.56,3.84,3.84,0,0,0,2.06-2.25A4,4,0,0,0,22.21,7.08Zm-1.7,2.44a1.9,1.9,0,0,1-1,1.09A7,7,0,0,0,15.37,17a7.3,7.3,0,0,0,.14,1.4,2.16,2.16,0,0,1-.31,1.65,1.79,1.79,0,0,1-1.21.8,8.72,8.72,0,0,1-1.62.15,9,9,0,0,1-9-9.28A9.05,9.05,0,0,1,11.85,3h.51a9,9,0,0,1,8.06,5A2,2,0,0,1,20.51,9.52ZM12.37,11a1,1,0,1,0,1,1A1,1,0,0,0,12.37,11Z"
              ></path>
            </svg>
          </div>

          {profile && (
            <button
              className="navbar__logout"
              onClick={() => {
                logout()
                  .then(() => navigate(`/login/?${query}`))
                  .catch(errMsg => alert(errMsg));
              }}
            >
              logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

// navigate('http://localhost:4000')
// '/login?redirect=/todo?page=1&tab=all'
// location.href; // http://localhost:4000/?page=1
// location.assign(searchParams.get('redirect'))
