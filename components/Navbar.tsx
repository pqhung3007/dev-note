import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useContext } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

import logo from "../public/assets/logo.png";
import avatar from "../public/assets/avatar.jpg";

import { UserContext } from "../lib/context";
import { auth } from "../lib/firebase";

export default function Navbar() {
  const { user, username } = useContext(UserContext);

  const router = useRouter();

  const handleSignOut = () => {
    auth.signOut();
    router.reload();
  };

  return (
    <div className="bg-white">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Image src={logo} alt="logo" className="h-20 w-auto" />
          </Link>

          {user ? (
            <div className="flex items-center">
              <Link href="/admin" className="mr-4">
                <button className="rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  Write Post
                </button>
              </Link>

              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                  <Image
                    src={user.photoURL}
                    loader={() => user.photoURL}
                    alt="user photo"
                    className="h-10 w-10 rounded-full object-cover"
                    width={40}
                    height={40}
                    referrerPolicy="no-referrer"
                  />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-4 w-40 origin-top-right divide-y divide-gray-200 rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        <h3 className="inline-flex w-full items-center px-4 py-2 font-medium text-gray-700">
                          Hello, {username} 👋
                        </h3>
                      </Menu.Item>
                    </div>

                    <div className="py-1">
                      <Menu.Item>
                        <Link
                          href={`/${username}`}
                          className="inline-flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                          <UserIcon className="mr-2 h-5 w-5 text-gray-500" />
                          Your account
                        </Link>
                      </Menu.Item>
                      <Menu.Item>
                        <button
                          className="inline-flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          onClick={handleSignOut}
                        >
                          <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5 text-gray-500" />
                          Sign out
                        </button>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          ) : (
            <Link href="/enter">
              <button className="rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Register now
              </button>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
