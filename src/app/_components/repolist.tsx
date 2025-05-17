"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
	AiOutlineArrowLeft,
	AiOutlinePlus,
	AiOutlineSearch,
} from "react-icons/ai";
import { BiErrorCircle } from "react-icons/bi";
import { FaGithub } from "react-icons/fa";
import { api } from "~/trpc/react";
import type { paths } from "~/types/gitSchema";

const RepoList = ({
	repo,
}: {
	repo: paths["/user/repos"]["get"]["responses"]["200"]["content"]["application/json"];
}) => {
	const router = useRouter();
	const utils = api.useUtils();
	const [search, setSearch] = useState("");
	const [stage, setStage] = useState(0);
	const [selected, setSelected] = useState(0);
	const [error, setError] = useState("");

	const createProject = api.project.create.useMutation({
		onSuccess: async (data) => {
			await utils.project.invalidate();
			setStage(0);
			setSelected(0);
			setError("");
			setSearch("");
			router.push(`/repo/${data.repoId}`);
		},
		onError: (err) => {
			setError(err.message);
			console.log(err);
		},
	});

	if (repo.length === 0) {
		return (
			<div className="mx-auto flex h-full items-center justify-center">
				No data found
			</div>
		);
	}

	// Debounce the search input eventually. Not needed for this small of users
	const filteredRepos = useMemo(() => {
		return repo.filter((d) =>
			d.full_name.toLowerCase().includes(search.toLowerCase()),
		);
	}, [repo, search]);

	const isCreating = createProject.status === "pending";

	if (isCreating) {
		return (
			<div className="mx-auto flex h-full items-center justify-center">
				<div className="flex flex-col items-center justify-center">
					<div className="flex h-10 w-10 animate-spin items-center justify-center rounded-full border-4 border-red-500 border-t-transparent border-solid"/>
						<p className="mt-2 font-semibold text-lg text-slate-200">
							Creating Project...
						</p>
				</div>
			</div >
		)
	}

	return (
		<div className="mx-auto flex h-full items-center justify-center">
			<div className="flex flex-col ">
				<div className="rounded-lg bg-slate-900 p-3">
					{stage === 0 && (
						<div className="group flex flex-grow items-center justify-center py-1">
							<input
								disabled={error !== ""}
								onChange={(e) => {
									e.preventDefault();
									setSearch(e.target.value);
								}}
								onClick={(e) => {
									e.preventDefault();
								}}
								value={search}
								placeholder={"Search for a repo"}
								className={
									"row-span-1 resize-none rounded-l-md bg-transparent px-2 py-1 outline outline-red-500 placeholder:text-red-400 placeholder:text-opacity-40 placeholder:opacity-50 disabled:bg-slate-800 disabled:outline-none disabled:placeholder:opacity-20 group-focus-within:outline-2 group-hover:outline-red-600"
								}
							/>

							<button
								type="button"
								className={
									"h-8 rounded-r-md px-2 py-1 outline outline-red-500 disabled:bg-slate-800 disabled:outline-none disabled:placeholder:opacity-20 group-focus-within:outline-2 group-hover:outline-red-600"
								}
							>
								<AiOutlineSearch className="" />
							</button>
						</div>
					)}

					<div
						className={
							"scrollbar-thin scrollbar-thumb-slate-600 top-100 left-0 z-40 max-h-48 w-full overflow-y-auto rounded bg-slate-700 bg-opacity-60 shadow "
						}
					>
						<div className="flex w-full flex-col">
							<div className="w-full cursor-pointer rounded">
								{stage === 0 ? (
									<>
										{filteredRepos.map((item, i) => (
											<div
												key={item.id}
												className={"w-full border-slate-800 border-b "}
											>
												<button
													type="button"
													className={`group flex w-full items-center gap-1 px-1 py-1 hover:bg-red-500 hover:text-slate-900 ${i === 0 && "border-red-500 border-l-4"
														}`}
													onClick={(e) => {
														e.preventDefault();
														console.log("Settings !");
														setSelected(item.id);
														setStage(1);
													}}
												>
													<FaGithub className="group-hover:animate-wiggle" />
													{item.full_name}
												</button>
											</div>
										))}
									</>
								) : (
									<div className={"w-full border-slate-800 border-b "}>
										<button
											type="button"
											className={
												"group flex w-full items-center gap-1 border-red-500 border-l-4 px-1 py-1 hover:bg-red-500 hover:text-slate-900"
											}
											onClick={(e) => {
												e.preventDefault();
												setStage(0);
											}}
										>
											<AiOutlineArrowLeft className="group-hover:animate-wiggle" />
											Back
										</button>
										<button
											type="button"
											className={
												"group flex w-full items-center gap-1 border-red-500 border-l-4 px-1 py-1 hover:bg-red-500 hover:text-slate-900"
											}
											onClick={(e) => {
												e.preventDefault();
												const item = repo?.find((d) => d.id === selected);
												console.log(item);
												if (item) {
													console.log(item);
													createProject.mutate({
														repoId: selected,
														name: item.full_name,
														description: item.description ?? undefined,
														ownerName: item.owner.login,
														ownerAvatar: item.owner.avatar_url,
														branch: item.default_branch,
														forks: item.forks_count,
														stars: item.stargazers_count,
														url: item.html_url,
													});
												} else {
													setStage(0);
												}
												console.log("create new project");
											}}
										>
											<AiOutlinePlus className="group-hover:animate-wiggle" />
											Create Project
										</button>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				{error !== "" && (
					<div className="mt-2 divide-rose-600 rounded bg-[#452B39] px-4 py-3">
						<div className="flex ">
							<div className="mr-4 h-5 w-5 content-center items-center justify-start">
								<BiErrorCircle
									className="text-red-300 leading-none"
									size={"1.25rem"}
								/>
							</div>
							<div className="flex flex-col ">
								<div className="mb-3 box-border flex items-center ">
									<span className="font-bold text-lg text-red-300 leading-none">
										Error
									</span>
								</div>
								<span className="font-normal text-white ">{error}</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default RepoList;
