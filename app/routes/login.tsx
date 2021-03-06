import { FormEvent, useState } from 'react';
import api from '../api';
import { ActionFunction, redirect, useFetcher } from 'remix';
import { Link } from 'react-router-dom';
import { commitSession, getSession } from '~/sessions';

export const action: ActionFunction = async ({ request }: { request: any }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const formData = await request.formData();
  const jwt = formData.get('jwt');
  const userId = formData.get('userId');

  session.set('userId', userId);
  session.set('jwt', jwt);
 
  // Login succeeded, send them to the home page.
  return redirect('/todos', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fetcher = useFetcher();

  const handleLogin = async (e: FormEvent<EventTarget>) => {
    e.preventDefault();

    try {
      const session = await api.createSession(email, password);
      const jwt = await api.createJWT();
      
      fetcher.submit(
        { userId: session.userId, jwt },
        { method: 'post' }
      )
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="container h-screen mx-auto flex">
      <div className="flex-grow flex flex-col max-w-xl justify-center p-6">
        <h1 className="text-6xl font-bold">Login</h1>
        <p className="mt-6">
          {' '}
          Don't have an account ?{' '}
          <Link
            className="cursor-pointer underline"
            to="/signup"
          >
            Sign Up
          </Link>{' '}
        </p>
        <form onSubmit={handleLogin}>
          <label className="block mt-6"> Email</label>
          <input
            className="w-full p-4 placeholder-gray-400 text-gray-700 bg-white text-lg border-0 border-b-2 border-gray-400 focus:ring-0 focus:border-gray-900"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="block mt-6"> Password</label>
          <input
            className="w-full p-4 placeholder-gray-400 text-gray-700 bg-white text-lg border-0 border-b-2 border-gray-400 focus:ring-0 focus:border-gray-900"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="mt-6">
            <button
              type="submit"
              disabled={!email || !password}
              className="mx-auto mt-4 py-4 px-16 font-semibold rounded-lg shadow-md bg-gray-900 text-white border hover:border-gray-900 hover:text-gray-900 hover:bg-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
