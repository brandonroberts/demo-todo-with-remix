import { Models } from 'appwrite';
import { json, LoaderFunction, redirect, useLoaderData } from 'remix';
import api from '~/api';
import { commitSession, getSession } from '~/sessions';

export const loader: LoaderFunction = async({request}) => {
  const session = await getSession(request.headers.get('Cookie'));
  const jwt = session.get('jwt');

  if (!jwt) {
    return redirect('/login');
  }
  api.provider();
  api.configure(process.env.APPWRITE_ENDPOINT as string, process.env.APPWRITE_PROJECT_ID as string);
  const todos = await api.listDocuments('todos');
  
  return json(
    { todos: todos.documents },
    {
      headers: {
        "Set-Cookie": await commitSession(session)
      }
    }
  );
}

export default function Todos() {
  const data = useLoaderData<{ todos: Models.Document[] }>();

  return (
    <div>Todos {data.todos.length}</div>
  );
}