import { useNavigate } from 'react-router-dom';
import { Navbar } from '../navbar/navbar';

export const NotFound = () => {
  const navigate = useNavigate();

  function handleClick() {
    return navigate(`/?tab=all&page=1`);
  }

  return (
    <>
      <Navbar />
      <body className="not-found">
        <span>404 | Not found.</span>
        <button onClick={handleClick}>back to todoList</button>
      </body>
    </>
  );
};
