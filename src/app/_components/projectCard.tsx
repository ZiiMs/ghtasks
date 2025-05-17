import type { Project } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { GoGitBranch, GoRepoForked, GoStar } from "react-icons/go";

const ProjectCard = ({ project }: { project: Project }) => {
	const repoName = project.name.split("/").at(1);
	const repoOwner = project.name.split("/").at(0);

	return (
		<Link className="group block h-full" href={`/repo/${project.repoId}`}>
			<div className="relative flex h-full flex-col rounded-md border border-red-500 bg-slate-900 p-3 transition-all duration-200 group-hover:bg-slate-800">
				<div className="flex items-center gap-2">
					{project.ownerAvatar && project.ownerAvatar !== "" ? (
						<div className="flex w-fit items-center justify-center overflow-hidden rounded-full bg-red-500 hover:cursor-pointer group-hover:bg-red-400">
							<Image
								src={project.ownerAvatar}
								alt={project.ownerName}
								width={32}
								height={32}
								className="rounded-full"
							/>
						</div>
					) : (
						<div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-red-500 hover:cursor-pointer group-hover:bg-red-400 ">
							<span className="text-2xl text-white">
								{project.ownerName.at(0)}
							</span>
						</div>
					)}
					<div className="flex items-center">
						<span className="text-sm opacity-80">{repoOwner}/</span>
						<span className="font-semibold text-xl ">{repoName}</span>
					</div>
				</div>
				{project.description && (
					<div className="flex items-center text-sm opacity-80">
						<span>{project.description}</span>
					</div>
				)}
				<div className="flex items-center gap-2 pt-3 text-sm opacity-80">
					<div className="flex items-center gap-1">
						<GoGitBranch />
						<span>{project.branch}</span>
					</div>
					<div className="flex items-center gap-1">
						<GoStar />
						<span>{project.stars}</span>
					</div>
					<div className="flex items-center gap-1">
						<GoRepoForked />
						<span>{project.forks}</span>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default ProjectCard;
