// import { useState } from "react";

import RepoList from "~/app/_components/repolist";
import { auth } from "~/server/auth";
import { HydrateClient, api } from "~/trpc/server";

export default async function NewProject() {
	// const [latestPost] = api.post.getLatest.useSuspenseQuery();

	// const utils = api.useUtils();
	const repos = await api.repo.get();
	const session = await auth();

	if (session?.user) {
		void api.repo.get.prefetch();
	}

	return (
		<HydrateClient>
			<div className="flex w-full items-center justify-center">
				{repos ? (
					<div className="flex w-full items-center justify-center">
						<RepoList repo={repos} />
					</div>
				) : (
					<p>You have no posts yet.</p>
				)}
			</div>
		</HydrateClient>
	);
}
