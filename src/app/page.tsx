import { HomePage, HomePageNoSession } from "~/app/_components/HomePage";
import ProjectCard from "~/app/_components/projectCard";
import { auth } from "~/server/auth";
import { HydrateClient, api } from "~/trpc/server";

export default async function Home() {
	const session = await auth();

	if (!session) {
		return <HomePageNoSession />;
	}

	const projects = await api.project.getAll();

	return (
		<HydrateClient>
			<main className="mx-auto h-full w-full px-4 py-8">
				{projects && projects.length > 0 ? (
					<div className="flex h-full w-full flex-col">
						<h1 className="mt-4 mb-2 w-full text-center font-bold text-3xl">
							Projects
						</h1>
						<div
							className={
								"grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4"
							}
						>
							{projects.map((project) => (
								<ProjectCard key={project.id} project={project} />
							))}
						</div>
					</div>
				) : (
					<HomePage />
				)}
			</main>
		</HydrateClient>
	);
}
