import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  redirect,
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigate,
} from 'remix';
import { FormEvent } from 'react';
import { Models } from 'appwrite';
import api from '~/api';
import TodoItem from '~/components/todo-item';
import Alert from '~/components/alert';
import { checkSession } from '~/sessions';

export const loader: LoaderFunction = async ({ request }) => {
  await checkSession(request);

  const todos = await api.listDocuments('todos');

  return json({ todos: todos.documents });
};

export const action: ActionFunction = async ({ request }) => {
  const session = await checkSession(request);
  const action = request.method.toLowerCase();
  const userId = session.get('userId');
  const form = await request.formData();
  let error: string | null = null;
  
  switch (action) {
    case 'post': {
      const content = form.get('content');

      const data = {
        content,
        isComplete: false,
      };
      try {
        await api.createDocument(
          'todos',
          data,
          [`user:${userId}`],
          [`user:${userId}`]
        );
      } catch(e) {
        error = 'Unable to create todo';
      }
      break;
    }

    case 'patch': {
      const id = form.get('todoId') as string;
      const todo = JSON.parse(form.get('todo') as string);

      try {
        await api.updateDocument(
          'todos',
          id,
          todo,
          [`user:${userId}`],
          [`user:${userId}`]
        );
      } catch(e) {
        error = 'Unble to update todo';
      }
      break;
    }

    case 'delete': {
      const id = form.get('todoId') as string;

      try {
        await api.deleteDocument('todos', id);
      } catch(e) {
        error = 'Unable to delete todo';
      }
      break;
    }
  }

  if (error) {
    return error;
  }

  return redirect('/todos');
};

export default function Todos() {
  const data = useLoaderData<{ todos: Models.Document[] }>();
  const error = useActionData<string>();
  const fetcher = useFetcher();
  const navigate = useNavigate();

  function handleComplete(
    e: FormEvent<EventTarget>,
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

  function handleDelete(e: FormEvent<EventTarget>, item: Models.Document) {
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
        {error && <Alert message="Something went wrong..." />}
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
