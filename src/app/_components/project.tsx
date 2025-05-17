// app/components/RepoTodos.tsx
"use client";

// import { useAutoAnimate } from "@formkit/auto-animate/react";
import classNames from "classnames";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";

import NewNotesDropdown from "~/app/_components/NewNoteButton";
import ContextMenu from "~/app/_components/contextmenu";
import Dropdown from "~/app/_components/dropdown";
import Loading from "~/app/_components/loading";
import Modal from "~/app/_components/modals/modal";
import Toasts from "~/app/_components/toasts";

import { Status, type Assignments, type Project } from "@prisma/client";
import { api } from "~/trpc/react";
import { formatStatus, getEnumKeys } from "~/utils/functions";

export default function ProjectData({ project }: { project: Project }) {
	const router = useRouter();
	const params = useParams();
	const repoId = Number(params.repoId);
	const utils = api.useUtils();

	// UI state
	const [focused, setFocused] = useState(false);
	const [menuInfo, setMenuInfo] = useState({
		x: 0,
		y: 0,
		selected: null as number | null,
		showMenu: false,
	});
	const [showModal, setShowModal] = useState(false);
	const [confirmInput, setConfirmInput] = useState("");
	const [openStatusDropdown, setOpenStatusDropdown] = useState(false);
	const [filter, setFilter] = useState("");
	const btnRef = useRef<HTMLButtonElement>(null);
	// const [parent] = useAutoAnimate<HTMLDivElement>();

	const [assignments] = api.assignment.getAll.useSuspenseQuery({
		projectId: project.id,
	});

	// Mutations
	const deleteProject = api.project.delete.useMutation({
		onSuccess(data) {
			utils.project.get.invalidate();
			Toasts.success({
				title: "Project deleted",
				body: `Project ${data.name} successfully deleted.`,
			});
			setShowModal(false);
			router.push("/");
		},
		onError(err) {
			Toasts.error({ title: "Failed to delete project", body: err.message });
		},
	});

	const { mutate: deleteAssignment, isPending: isTryingDeleteAssignment } =
		api.assignment.delete.useMutation({
			onSuccess(data) {
				utils.assignment.getAll.invalidate();
				Toasts.success({
					title: "Assignment deleted",
					body: `Assignment ${data.name} successfully deleted.`,
				});
			},
			onError(err) {
				Toasts.error({
					title: "Failed to delete assignment",
					body: err.message,
				});
			},
		});

	// Click‑outside handler for dropdown
	useEffect(() => {
		const handle = (e: MouseEvent) => {
			if (!btnRef.current?.contains(e.target as Node)) {
				setFocused(false);
			}
		};
		document.addEventListener("mousedown", handle);
		return () => document.removeEventListener("mousedown", handle);
	}, []);

	if (!project) return <Loading />;
	if (!assignments) return <Loading />;

	// Helpers
	const splitStatusColor = (statusColor: string) => {
		const [color, variant = "100"] = statusColor.split("-");
		return { color, variant: Number(variant) };
	};
	const getBorderColor = (a: Assignments) => `border-${a.statusColor}`;

	return (
		<>
			<div className="flex h-full w-full flex-col gap-2">
				<div className="flex justify-between">
					<h1 className="flex items-center font-bold text-2xl">
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
						<div
							className="relative flex items-end justify-center self-center"
							onClick={(e) => {
								e.preventDefault();
								setFocused((f) => !f);
							}}
						>
							<span>{project.name}</span>
							<FiChevronDown />
							<div
								className={classNames(
									focused ? "visible" : "hidden",
									"mt-1 text-base",
								)}
							>
								<div
									className={"scrollbar-thin scrollbar-thumb-slate-600 top absolute right-0 z-10 mt-1 max-h-48 w-fit overflow-y-auto rounded bg-slate-900 p-1 shadow"}
								>
									<div className="flex w-full flex-col rounded bg-slate-700">
										<div className="w-full cursor-pointer rounded">
											<div className="w-full border-slate-800 border-b">
												<button
													ref={btnRef}
													className="group flex select-none items-center gap-1 px-1 py-1 hover:bg-red-500 hover:text-slate-900"
													onClick={(e) => {
														console.log("Clicking Delete")
														setFocused(false);
														setShowModal(true);
													}}
												>
													<MdDeleteForever className="group-hover:animate-wiggle" />
													Delete
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<Link href={project.url} target="_blank">
							<div className="mx-2 flex h-fit rounded bg-slate-900 p-1 hover:bg-opacity-60">
								<FaGithub />
							</div>
						</Link>
					</h1>

					<div className="flex select-none self-center rounded-md disabled:cursor-not-allowed disabled:bg-opacity-25 disabled:text-red-500/25">
						<button
							className={classNames(
								"rounded-l-md border-red-500 border-r px-2 py-1 font-medium hover:cursor-pointer hover:bg-opacity-60",
								filter ? "bg-red-500 text-slate-900" : "bg-slate-900",
							)}
						>
							Filter
						</button>
						<button
							onClick={(e) => {
								e.preventDefault();
								setFilter((f) => (f === "todo" ? "" : "todo"));
							}}
							className={classNames(
								"border-red-500 border-r px-2 py-1 font-medium hover:cursor-pointer hover:bg-opacity-60",
								filter === "todo"
									? "bg-red-500 text-slate-900"
									: "bg-slate-900 text-red-500",
							)}
						>
							Notes
						</button>
						<button
							onClick={(e) => {
								e.preventDefault();
								setFilter((f) => (f === "note" ? "" : "note"));
							}}
							className={classNames(
								"rounded-r-md px-2 py-1 font-medium hover:cursor-pointer hover:bg-opacity-60",
								filter === "note"
									? "bg-red-500 text-slate-900"
									: "bg-slate-900 text-red-500",
							)}
						>
							Todos
						</button>
					</div>

					<NewNotesDropdown id={project.id} />
				</div >

				<div className="flex h-full flex-col items-start justify-start">
					{assignments.map((assignment) =>
						assignment.type.toLowerCase() === filter ? null : (
							<div key={assignment.id} className="flex w-full p-1">
								<div
									className={`border-l-4 ${getBorderColor(assignment)} flex w-full flex-col rounded-md bg-slate-900 p-2 text-slate-300 shadow-lg outline outline-slate-800 hover:cursor-pointer hover:bg-black hover:bg-opacity-60`}
									onContextMenu={(e) => {
										e.preventDefault();
										setMenuInfo({
											showMenu: true,
											x: e.pageX,
											y: e.pageY,
											selected: assignment.id,
										});
									}}
								>
									<div className="flex w-full items-start justify-between">
										<div>
											<div>{assignment.name}</div>
											<div>{assignment.description}</div>
										</div>
										<div className="flex flex-col items-end">
											<div>
												<button
													onClick={(e) => {
														e.preventDefault();
														setOpenStatusDropdown(true);
													}}
													className={classNames(
														"w-fit rounded-md px-2 font-bold",
														`bg-${assignment.statusColor}`,
														splitStatusColor(assignment.statusColor).variant >=
															500
															? `text-${splitStatusColor(assignment.statusColor).color}-200`
															: `text-${splitStatusColor(assignment.statusColor).color}-900`,
													)}
												>
													{formatStatus(assignment.status)}
												</button>
												<Dropdown
													open={openStatusDropdown}
													caret
													onClose={() => setOpenStatusDropdown(false)}
												>
													<ul className="space-y-1">
														{getEnumKeys(Status).map((key) => (
															<li
																key={key}
																className="rounded bg-slate-700 p-1"
															>
																{formatStatus(Status[key])}
															</li>
														))}
													</ul>
												</Dropdown>
											</div>
											<div>{assignment.updatedAt.toLocaleDateString()}</div>
										</div>
									</div>
								</div>
							</div>
						),
					)}
				</div>
			</div >

			<Modal isOpen={showModal} onClose={() => setShowModal(false)}>
				<div className="flex h-full max-w-sm flex-col">
					<h2 className="text-center font-medium text-xl">Delete Project</h2>
					<div className="mt-2 w-full border-slate-800 border-t" />
					<div className="flex flex-col p-2">
						<span className="text-ellipsis">
							This action cannot be undone. It will permanently delete{" "}
							<span className="select-none font-semibold italic">
								{project.name}
							</span>
							.
						</span>
						{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
						<label className="py-2">
							Please type{" "}
							<span className="select-none font-bold italic">
								{project.name}
							</span>{" "}
							to confirm
						</label>
						<input
							value={confirmInput}
							onChange={(e) => setConfirmInput(e.target.value)}
							className="rounded bg-transparent p-1 text-sm outline outline-red-500"
						/>
					</div>
					<div className="mt-2 w-full border-slate-800 border-t" />
					<div className="flex p-2">
						<button
							disabled={confirmInput !== project.name}
							onClick={() => deleteProject.mutate({ id: project.id })}
							className="w-full rounded p-1 outline outline-red-500 hover:bg-red-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-red-500/50 disabled:outline-red-500/50"
						>
							I understand the consequences of this action
						</button>
					</div>
				</div>
			</Modal>

			<ContextMenu
				showMenu={menuInfo.showMenu}
				x={menuInfo.x}
				y={menuInfo.y}
				toggleMenu={() =>
					setMenuInfo({ ...menuInfo, showMenu: false, selected: null })
				}
			>
				<ul className="cursor-pointer select-none divide-y divide-red-500">
					<li>
						<button
							disabled={isTryingDeleteAssignment}
							onClick={() => {
								setMenuInfo({ showMenu: false, x: 0, y: 0, selected: null });
							}}
							className="w-full px-2 py-2 hover:bg-slate-700/40 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-red-500/50 disabled:outline-red-500/50"
						>
							Edit
						</button>
					</li>
					<li>
						<button
							disabled={isTryingDeleteAssignment}
							onClick={() => {
								if (menuInfo.selected) {
									deleteAssignment({ id: menuInfo.selected });
								}
								setMenuInfo({ showMenu: false, x: 0, y: 0, selected: null });
							}}
							className="w-full px-2 py-2 hover:bg-slate-700/40 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-red-500/50 disabled:outline-red-500/50"
						>
							Delete
						</button>
					</li>
				</ul>
			</ContextMenu>
		</>
	);
}
