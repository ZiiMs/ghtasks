import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { Toaster } from "react-hot-toast";
import { auth } from "~/server/auth";
import { TRPCReactProvider } from "~/trpc/react";
import { Navbar } from "./_components/navbar";

export const metadata: Metadata = {
	title: "Github Tasks",
	description: "Todo app with github integration",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const session = await auth();

	return (
		<html lang="en" className={`${geist.variable}`}>
			<body>
				<TRPCReactProvider>
					<div className="flex w-full flex-col sm:h-auto md:h-screen">
						<div className="-z-20 fixed h-full w-full bg-slate-800 " />
						<div
							className={
								"-z-10 fixed inset-0 h-full w-full bg-[url(/img/grid.svg)] bg-center [mask-image:radial-gradient(rgba(241,245,249,0.1),rgba(148,163,184,1));]"
							}
						/>
						<Navbar session={session} />

						<div className="container mx-auto">
							{children}
							<Toaster />
						</div>
					</div>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
