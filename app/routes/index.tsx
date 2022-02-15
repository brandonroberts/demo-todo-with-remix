import { LoaderFunction, useLoaderData, useNavigate } from 'remix';
import { github, twitter, appwrite, react } from '../icons';

export type LinkItem = {
  href: string;
  icon: Function
}

export const loader: LoaderFunction = () => {
  const links = [
    {
      href: "http://github.com/appwrite/appwrite",
      icon: github(10),
    },
    {
      href: "https://twitter.com/appwrite_io",
      icon: twitter(10),
    },
    {
      href: "http://appwrite.io",
      icon: appwrite(10),
    },
  ];

  return links;
}

export default function Index() {
  const links = useLoaderData<LinkItem[]>();
  const navigate = useNavigate();

  function handleClick() {
    navigate('/login');
  }

  return (
    <>
      <section className="container h-screen mx-auto flex">
        <div className="flex flex-col mx-auto justify-center p-6 text-center">
          <p className="my-8 text-xl md:text-2xl lg:text-3xl font-medium">Introducing</p>
          <h1 className="text-4xl md:text-7xl lg:text-9xl font-bold">toTooooDoooo</h1>
          <p className="my-8 text-xl md:text-2xl lg:text-3xl font-medium">
            {/* A Simple To-do App built with {appwrite(8)} Appwrite and {react(8)}{" "} */}
            {/* React */}
            A Simple To-do App built with Appwrite and React
          </p>
          <button
            onClick={handleClick}
            className="mx-auto mt-4 py-3 lg:py-5 px-10 lg:px-24 text-lg md:text-2xl font-semibold  rounded-lg shadow-md bg-white text-gray-900 border border-gray-900 hover:border-transparent hover:text-white hover:bg-gray-900 focus:outline-none"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* <section className="absolute bottom-0 right-0 py-3 px-6 mr-8 mb-8 flex">
        {links.map((item: LinkItem, index: number) => (
          <div className="rounded-full mx-4 transition duration-200 ease-in-out transform hover:-translate-y-3 hover:scale-125 hover:shadow-4xl" key={index}>
            <a href={item.href}>{item.icon}</a>
          </div>
        ))}
      </section> */}
    </>
  );
}
