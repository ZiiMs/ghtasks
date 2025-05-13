
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { auth } from "~/server/auth";
import { HydrateClient, api } from "~/trpc/server";

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="navbar w-full bg-slate-900 ">
      <div className="container z-10 mx-auto flex h-full w-full flex-row items-center justify-between px-4 py-2">
        <div className="flex h-full">
          <Link href={"/"} passHref className="flex">
            <button
              type="button"
              className="flex h-full flex-shrink-0 items-center gap-1 rounded-md px-2 hover:bg-slate-800 hover:text-red-600 focus:outline focus:outline-2 focus:outline-red-500"
            >
              <FaGithub />
              Notes
            </button>
          </Link>
        </div>
        <div className="flex gap-6">
          <Link href={"/repo/new"} passHref className="flex">
            <button
              type="button"
              className="flex items-center gap-1 rounded-md px-2 hover:bg-slate-800 hover:text-red-600 focus:outline focus:outline-2 focus:outline-red-500"
            >
              New Project
            </button>
          </Link>
          {session?.user ? (
            <Link href={"/api/auth/signout"} passHref className="flex">
              <button
                type="button"
              >
                <Image
                  src={session.user.image ?? ""}
                  alt={session.user.name ?? "Unknown"}
                  className={session.user.image ? "bg-transparent" : ""}
                  width={32}
                  height={32}
                />
              </button>
            </Link>
          ) : (
            <>
              <Link href={"/api/auth/signin"} passHref className="flex">
                <button
                  type="button"
                  className="flex flex-row items-center gap-1 rounded-md bg-white px-2 py-1 font-semibold text-gray-900 hover:bg-gray-100 active:scale-95 active:bg-gray-100"

                >
                  <FaGithub />
                  Sign in with Github
                </button>
              </Link>

            </>
          )}
        </div>
      </div>
    </nav>
  );
}
