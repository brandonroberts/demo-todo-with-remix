import {
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "remix";
import type { MetaFunction } from "remix";
import styles from './styles.css';
import api from './api';

export const loader: LoaderFunction = async() => {
  api.provider().setEndpoint(process.env.APPWRITE_ENDPOINT as string);
  api.provider().setProject(process.env.APPWRITE_PROJECT_ID as string);

  return {
    ENV: {
      APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT,
      APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID
    }
  };
}

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function App() {
  const data = useLoaderData();
  api.provider().setEndpoint(data.ENV.APPWRITE_ENDPOINT);
  api.provider().setProject(data.ENV.APPWRITE_PROJECT_ID);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
