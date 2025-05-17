"use client";
import type { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";

export function Navbar({ session }: { session: Session | null }) {
	const router = useRouter();
	return (
		<nav className="navbar w-full bg-slate-900 ">
			<div className="container z-10 mx-auto flex h-full w-full flex-row items-center justify-between px-4 py-2">
				<div className="flex h-full">
					<Link href={"/"} passHref className="flex">
						<button
							type="button"
							className="flex h-full flex-shrink-0 items-center gap-1 rounded-md px-2 hover:bg-slate-800 hover:text-red-600 focus:outline focus:outline-red-500"
						>
							<FaGithub />
							Notes
						</button>
					</Link>
				</div>
				<div className="flex gap-6">
					{session?.user ? (
						<>
							<Link href={"/repo/new"} passHref className="flex">
								<button
									type="button"
									disabled={!session}
									className="flex items-center gap-1 rounded-md px-2 hover:bg-slate-800 hover:text-red-600 focus:outline focus:outline-red-500"
								>
									New Project
								</button>
							</Link>
							<button
								type="button"
								className="flex items-center justify-center overflow-hidden rounded-full bg-slate-800 hover:cursor-pointer hover:bg-slate-700"
								onClick={() => {
									console.log("Tester");
									signOut();
									router.push("/");

								}}
							>
								<Image
									src={session.user.image ?? ""}
									alt={session.user.name ?? "Unknown"}
									className={session.user.image ? "bg-transparent" : ""}
									width={32}
									height={32}
								/>
							</button>
						</>
					) : (
						<button
							type="button"
							onClick={() => {
								console.log("Tester");
								signIn("github");
							}}
							className="flex flex-row items-center gap-1 rounded-md bg-white px-2 py-1 font-semibold text-gray-900 hover:bg-gray-100 active:scale-95 active:bg-gray-100"
						>
							<FaGithub />
							Sign in with Github
						</button>
					)}
				</div>
			</div>
		</nav>
	);
}
