//@ts-check
import { delay } from '../delay/delay';
import { useRouteError, useNavigate } from 'react-router-dom';

export const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  let title = 'An error occurred!!';
  let message = 'Could not find this page';
  console.log('error', error);

  // if (error instanceof Response && error.status === 404) {
  //   return <Navigate />
  //   error;
  //   error.status;
  // }

  // question: 型別
  // if (error.status === 404) {
  //   console.log('404');
  //   title = error.status;
  //   message = error.data.message;
  // }

  delay(0).then(() => navigate('/login'));

  return (
    <div className="error-page">
      <h1>{title}</h1>
      <h2>{message}</h2>
    </div>
  );
};
