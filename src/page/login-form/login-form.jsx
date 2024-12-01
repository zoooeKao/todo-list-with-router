// @ts-check
import { useState } from 'react';
import { redirect } from 'react-router';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../../components/navbar/navbar';
import { useThemeState } from '../../model/context/context';
import { getProfile } from '../../service/get-profile';
import { login } from '../../service/login';
import './login-form.scss';
import { TextInput } from './text-input';

const getLocalStorageUsername = localStorage.getItem('username');

export const loginFormLoader = ({ request }) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  let tab = /** @type {import('../../model/global-state').TabState} */ (searchParams.get('tab') || 'all');
  let page = /** @type {string} */ (searchParams.get('page') || '1');
  // let needRedirect = false;
  // console.log('loginForm request', { request }, 'searchParams', searchParams);

  // if (!['all', 'pending', 'completed'].includes(tab)) {
  //   tab = 'all';
  //   needRedirect = true;
  // }
  // if (!Number.isInteger(Number(page)) || parseInt(page) <= 0) {
  //   console.log('page');
  //   page = '1';
  //   needRedirect = true;
  // }
  // if (needRedirect) {
  //   searchParams.set('tab', tab);
  //   searchParams.set('page', page);
  //   // return redirect(`/?tab=${tab}&page=1`);
  // }

  return getProfile()
    .then(() => redirect(`/?tab=${tab}&page=${page}`))
    .catch(() => {
      // searchParams.set('redirect', 'tab=all&page=1');
      return null;
    });
  // .catch(() => null);
};

/**
 * @type {React.FC}
 */
export const LoginForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { themeState } = useThemeState();

  const [username, setUsername] = useState(getLocalStorageUsername || 'emilys');
  const [password, setPassword] = useState('emilyspass');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const redirect = searchParams.get('redirect') ?? '';
  const params = new URLSearchParams(redirect);
  let tab = params.get('tab') || 'all';
  let page = params.get('page') || '1';
  // let needRedirect = false;

  console.log('redirect:', redirect, 'params:', params); //tab=all {'tab','all'} all 1

  // TODO: 驗證資料封裝

  /** @type {React.FormEventHandler<HTMLFormElement>} */
  const handleSubmit = e => {
    e.preventDefault();
    setIsSubmitting(true);
    login(username, password)
      .then(() => {
        remember ? localStorage.setItem('username', username) : localStorage.removeItem('username');
        // const url = `/?tab=${tab}&page=${curPage}`;
        const url = `/?tab=${tab}&page=${page}`;
        console.log({ url });
        navigate(url);
      })
      .catch(errMsg => {
        setHasError(true);
        setUsername('');
        setPassword('');
        alert(errMsg);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  /** @type {React.MouseEventHandler<HTMLButtonElement> } */
  const handleReset = () => {
    setUsername('');
    setPassword('');
    setShowPassword(false);
    setRemember(false);
    setIsSubmitting(false);
    setHasError(false);
    localStorage.removeItem('username');
  };

  return (
    <>
      <Navbar />
      <form className={`login login--${themeState}`} onSubmit={handleSubmit}>
        <div className="login__container">
          <h1 className="title">Login</h1>
          {hasError && <div className="login__error">Please enter the correct username or password!</div>}
          <TextInput>
            <span>username:</span>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              readOnly={isSubmitting}
              autoFocus
            />
          </TextInput>
          <TextInput>
            <span>password:</span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              readOnly={isSubmitting}
            />
          </TextInput>
          <label>
            <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} />
            remember me
          </label>
          <br />
          <label>
            <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
            show password
          </label>
          <div className="login__btnWrapper">
            <button className="login__btn" type="submit" disabled={isSubmitting}>
              submit
            </button>
            <button className="login__btn" type="reset" onClick={handleReset} disabled={isSubmitting}>
              reset
            </button>
          </div>
          <br />
        </div>
      </form>
    </>
  );
};
