import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  redirect,
  useFetcher,
  useLoaderData,
  useNavigate,
} from 'remix';
import { Models } from 'appwrite';
import api from '~/api';
import TodoItem from '~/components/todo-item';
import { getSession } from '~/sessions';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const jwt = session.get('jwt');

  if (!jwt) {
    return redirect('/login');
  }

  api.setJWT(jwt.toString());
  const todos = await api.listDocuments('todos');

  return json({ todos: todos.documents });
};

export const action: ActionFunction = async ({ request }) => {
  const action = request.method.toLowerCase();
  const session = await getSession(request.headers.get('Cookie'));
  const jwt = session.get('jwt');
  const userId = session.get('userId');
  const form = await request.formData();
  api.provider().setJWT(jwt.toString());

  switch (action) {
    case 'post': {
      const content = form.get('content');

      const data = {
        content,
        isComplete: false,
      };
      await api.createDocument(
        'todos',
        data,
        [`user:${userId}`],
        [`user:${userId}`]
      );
      break;
    }

    case 'patch': {
      const id = form.get('todoId') as string;
      const todo = JSON.parse(form.get('todo') as string);

      await api.updateDocument(
        'todos',
        id,
        todo,
        [`user:${userId}`],
        [`user:${userId}`]
      );
      break;
    }

    case 'delete': {
      const id = form.get('todoId') as string;

      await api.deleteDocument('todos', id);
      break;
    }
  }

  return redirect('/todos');
};

export default function Todos() {
  const data = useLoaderData<{ todos: Models.Document[] }>();
  const fetcher = useFetcher();
  const navigate = useNavigate();

  function handleComplete(
    e: any,
    todo: Models.Document & { isComplete: boolean }
  ) {
    e.preventDefault();

    fetcher.submit(
      {
        todoId: todo.$id,
        todo: JSON.stringify({ ...todo, isComplete: !todo.isComplete }),
      },
      { method: 'patch' }
    );
  }

  function handleDelete(e: any, item: Models.Document) {
    e.preventDefault();

    fetcher.submit({ todoId: item.$id }, { method: 'delete' });
  }

  async function handleLogout() {
    await api.deleteCurrentSession();

    navigate('/login');
  }

  return (
    <>
      <section className="container h-screen max-h-screen px-3 max-w-xl mx-auto flex flex-col">
        {/* {isError && <Alert color="red" message="Something went wrong..." />} */}
        <div className="my-auto p-16 rounded-lg text-center">
          <div className="font-bold text-3xl md:text-5xl lg:text-6xl">
            📝 <br /> &nbsp; toTooooDoooos
          </div>

          <Form method="post">
            <input
              type="text"
              name="content"
              className="w-full my-8 px-6 py-4 text-xl rounded-lg border-0 focus:ring-2 focus:ring-gray-800 transition duration-200 ease-in-out transForm hover:-translate-y-1 hover:scale-110 hover:shadow-xl shadow-md"
              placeholder="🤔   What to do today?"
              required={true}
            ></input>
          </Form>

          <ul>
            {data.todos.map((item) => (
              <TodoItem
                key={item.$id}
                item={item}
                handleComplete={handleComplete}
                handleDelete={handleDelete}
              />
            ))}
          </ul>
        </div>
      </section>

      <section className="absolute bottom-0 right-0 py-3 px-6 mr-8 mb-8">
        <button
          onClick={handleLogout}
          className="mx-auto mt-4 py-3 px-12 font-semibold text-md rounded-lg shadow-md bg-white text-gray-900 border border-gray-900 hover:border-transparent hover:text-white hover:bg-gray-900 focus:outline-none"
        >
          Logout 👋
        </button>
      </section>
    </>
  );
}
