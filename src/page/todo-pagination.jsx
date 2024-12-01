// @ts-check
import { useEffect, useState } from 'react';
import { redirect } from 'react-router';
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';
import { AddNewTodo } from '../components/add-new-todo/add-new-todo';
import { delay } from '../components/delay/delay';
import { Navbar } from '../components/navbar/navbar';
import { TodoListPage } from '../components/todo-list-page/todoList-page';
import { TodoListTab } from '../components/todo-list-tab/todo-list-tab';
import { useThemeState } from '../model/context/context';
import { LIMIT } from '../model/magic-number';
import { fetchCreateTodo } from '../service/create-todo';
import { fetchDeletePendingCompletedTodo } from '../service/delete-todo';
import { fetchDeleteTodoById } from '../service/delete-todo-id';
import { getProfile } from '../service/get-profile';
import { fetchReadTodo } from '../service/read-todo';
import { fetchEditTodo } from '../service/update-todo';
import { Pagination } from './pagination/pagination';
import './todo-table.scss';

/** @typedef {Exclude<Awaited<ReturnType<typeof todoPaginationLoader>>, Response>} ReturnTodoLoader */

export const todoPaginationLoader = ({ request }) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  let tab = /** @type {import('../model/global-state').TabState} */ (url.searchParams.get('tab'));
  let page = /** @type {string} */ (url.searchParams.get('page'));
  console.log('todo loader', searchParams);

  if (!['all', 'pending', 'completed'].includes(tab) || !Number.isInteger(Number(page)) || parseInt(page) <= 0) {
    return redirect('/404');
  }

  return getProfile()
    .then(profile => Promise.all([profile, fetchReadTodo(profile.id, LIMIT, LIMIT * (Number(page) - 1), tab)]))
    .then(([profile, todoPayload]) => ({ profile, todoPayload, tab, page }))
    .catch(errMsg => {
      return errMsg === 'get profile fail'
        ? redirect(`/login/?redirect=${encodeURIComponent('tab=all&page=1')}`)
        : redirect(`?tab=all&page=1`);
    });
};

export const TodoPagination = () => {
  // third part
  const { profile, todoPayload, tab, page } = /** @type {ReturnTodoLoader} */ (useLoaderData());
  console.log('<todo>', { todoPayload, tab, page });

  // Code Review: 一個資料存在記憶體，一個存在URL，容易導致未同步的情況，所以這邊統一存到URL來處裡。
  const [, setSearchParams] = useSearchParams({ tab: tab, page: page });
  const navigate = useNavigate();

  // global state
  const { themeState } = useThemeState();

  // local state
  const [todoState, setTodoState] = useState(/** @type {import('../model/global-state').TodoState} */ (todoPayload));
  console.log('todoState', todoState);

  // Code Review : CUD 一次只能做一件事 -> 可行
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addStatus, setAddStatus] = useState(/** @type {import('../model/global-state').AddState} */ ('typing'));

  const userId = profile.id;
  // let tab = /** @type {import('../model/global-state').TabState} */ (searchParams.get('tab') || 'all');
  // let page = /**@type {string} */ (searchParams.get('page') || '1');
  // let needRedirect = false;
  let skip = (parseInt(page) - 1) * LIMIT;

  // console.log('<todo>', 'tab', tab, 'page', page, 'searchParams', searchParams);

  // handler
  // Code Review : 需要放到 useEffect 嗎？ click -> submit -> event handler -> no
  /**
   * @param {string} addTodoItem
   */
  function handleCreateTodo(addTodoItem) {
    setAddStatus('adding');

    Promise.all([fetchCreateTodo(addTodoItem, userId), delay(2000)])
      .then(() => {
        setAddStatus('success');
        return fetchReadTodo(userId, LIMIT, skip, tab);
      })
      .then(newPayload => setTodoState(() => ({ todos: [...newPayload.todos], total: newPayload.total })))
      .catch(() => setAddStatus('error'))
      .finally(() => setTimeout(() => setAddStatus('typing'), 1000));
  }

  // component TodoListTab
  function handleDeleteTabTodo() {
    setIsSubmitting(true);
    fetchDeletePendingCompletedTodo(userId, LIMIT, skip, tab)
      .then(() => fetchReadTodo(userId, LIMIT, skip, tab))
      .then(payload => {
        setTodoState(payload);
      })
      .catch(errMsg => alert(errMsg))
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  /**
   * @param {import('../model/global-state').Todo} editTodoItem
   */
  function handleEditTodo(editTodoItem) {
    setIsSubmitting(true);
    fetchEditTodo(editTodoItem.id, editTodoItem.completed, editTodoItem.todo)
      .then(() => fetchReadTodo(userId, LIMIT, skip, tab))
      .then(payload => {
        setTodoState(payload);
      })
      .catch(errMsg => alert(errMsg))
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  /**
   * @param {import('../model/global-state').Todo['id']} id
   */
  function handleDeleteTodo(id) {
    setIsSubmitting(true);
    fetchDeleteTodoById(id)
      .then(() => fetchReadTodo(userId, LIMIT, skip, tab))
      .then(payload => {
        setTodoState(payload);
      })
      .catch(errMsg => alert(errMsg))
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  // effect
  useEffect(() => {
    // TODO 驗證
    console.log('useEffect[]');
    if (todoState.total > 0 && parseInt(page) > Math.ceil(todoState.total / LIMIT)) {
      console.log('go to 404');
      console.log('inside todoPayload 2', todoPayload);
      navigate('/404');
    }
  }, []);

  // Code review: 更改 url 後，loader 重新執行，元件不會 unmount，所以 state 不會更新
  useEffect(() => {
    console.log('inside todoPayload', todoPayload);
    setTodoState(todoPayload);
  }, [todoPayload]);

  return (
    <>
      <Navbar />
      <body>
        <div className={`todo-table todo-table--${themeState}`}>
          <div className="todo-table__container">
            <h1 className="title">Todo List</h1>
            <AddNewTodo
              // Code review : ternary operator
              onAdd={addTodoItem => (!isSubmitting ? handleCreateTodo(addTodoItem) : undefined)}
              addStatus={addStatus}
            />
            <TodoListTab
              tab={tab}
              onTab={nextTab => (!isSubmitting ? setSearchParams({ tab: nextTab, page: '1' }) : undefined)}
              onClear={() => (!isSubmitting ? handleDeleteTabTodo() : undefined)}
            />
            <TodoListPage
              todoList={todoState.todos ?? []}
              edit={editTodoItem => (!isSubmitting ? handleEditTodo(editTodoItem) : undefined)}
              del={id => (!isSubmitting ? handleDeleteTodo(id) : undefined)}
            />
            <Pagination
              total={todoState.total}
              limit={LIMIT}
              curPage={parseInt(page)}
              onPage={page => (!isSubmitting ? setSearchParams({ tab: tab, page: String(page) }) : undefined)}
            />
          </div>
        </div>
      </body>
    </>
  );
};

// 驗證使用者輸入的 searchParams 有三種方法：
// (1) 拉高一層到元件做判斷
// const Parent = () => {
//   const [searchParams] = useSearchParams();

//   return ['all', 'pending', 'completed'].includes(searchParams.get('tab')) ? (
//     <TodoListPage />
//   ) : (
//     <Navigate to="/?tab=all" />
//   );
// };
// (2) 或在原本的階層在loader裡面解決
// (3) 或在原本階層的元件裡面解決
