import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import ProjectData from "~/app/_components/project";
import { auth } from "~/server/auth";
import { HydrateClient, api } from "~/trpc/server";

export default async function ProjectId({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: repoid } = await params;
  const project = await api.project.get({ repoId: Number.parseInt(repoid) });
  const session = await auth();



  return (
    <div className="flex h-full w-full items-center justify-center py-2">
      <ProjectData project={project}/>
    </div>
  );
}
