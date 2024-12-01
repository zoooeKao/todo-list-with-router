import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { NotFound } from './components/not-found/not-found';
import { LoginForm, loginFormLoader } from './page/login-form/login-form';
import { TodoPagination, todoPaginationLoader } from './page/todo-pagination';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <TodoPagination />,
        loader: todoPaginationLoader,
      },
      {
        path: 'login',
        element: <LoginForm />,
        loader: loginFormLoader,
      },
      {
        path: '404',
        element: <NotFound />,
      },
    ],
  },
]);

// - app
//   - login page
//     - loader: has profile ? redirect : stay
//   - other pages entry
//     - loader: has profile ? stay : redirect
//     - children
//       - share the profile from the "other pages entry"'s loader

// TODO Features:
// - shouldRevalidate
// - add searchParams
// - 上下頁(切換 tab, login & logout)
// - replace useEffect get initial get data -> loader
// - error status

// - 點擊 tab
//   - 更新 tabState
//   - 觸發 useEffect
//   - 打 API
//   - setSearchParams(tabState) [Ques: 這邊做比較好還是拉到 useEffect]
//   - [Ques: 按了上一頁 url 更新了，網頁沒有跟著變動]
// - 更改 url
//   - 取值及驗證
//   - 更新 tabState
//   - 觸發 useEffect
//   - 打 API
//   - setSearchParams
