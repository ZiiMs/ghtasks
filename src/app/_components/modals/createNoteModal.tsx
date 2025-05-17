"use client";

import { Status, Type } from "@prisma/client";
import classNames from "classnames";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { FaGithub } from "react-icons/fa";
import { z } from "zod";
import Modal from "~/app/_components/modals/modal";
import { api } from "~/trpc/react";
import { formatStatus, getEnumKeys } from "~/utils/functions";
import Toasts from "../toasts";

type ModalType = {
	isOpen: boolean;
	onClose: () => void;
	id: number;
	type: Type;
};

const CreateModal: React.FC<ModalType> = ({ isOpen, onClose, id, type }) => {
	const AssignmentSchema = z.object({
		name: z.string().min(1),
		description: z.string(),
		status: z.nativeEnum(Status),
		statusColor: z.object({
			color: z.string(),
			variant: z.number(),
		}),
	});
	type Assignment = z.infer<typeof AssignmentSchema>;
	const [form, setForm] = useState<Assignment>({
		name: "",
		description: "",
		status: "OPEN",
		statusColor: {
			color: "",
			variant: 800,
		},
	});
	const [showColors, setShowColors] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	const utils = api.useUtils();
	const { mutate, isPending: isLoading } = api.assignment.create.useMutation({
		onSuccess: async (data) => {
			console.log(data);
			await utils.assignment.getAll.invalidate({ projectId: id });

			Toasts.success({
				title: "Success",
				body: `${data.type.toLocaleLowerCase()} created: ${data.name}`,
			});
			setForm({
				name: "",
				description: "",
				status: "OPEN",
				statusColor: {
					color: "",
					variant: 800,
				},
			});
			onClose();
		},
		onError: (err) => {
			console.log(err);
		},
	});

	useEffect(() => {
		const bodyClick = (e: MouseEvent) => {
			if (
				ref.current?.contains(e.target as Node) ||
				buttonRef.current?.contains(e.target as Node)
			) {
				console.log("Clicked", buttonRef.current);
				return;
			}
			setShowColors(false);
		};
		document.addEventListener("click", bodyClick);
		return () => {
			document.removeEventListener("click", bodyClick);
		};
	}, []);

	const colors = [
		"stone",
		"red",
		"yellow",
		"green",
		"blue",
		"indigo",
		"purple",
		"pink",
	];
	const variants = [100, 200, 300, 400, 500, 600, 700, 800, 900];

	const getBgColor = (color: string, variant: number) => {
		return `bg-${color}-${variant}`;
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<div className="flex h-full w-full flex-col">
				<h1 className="text-center font-bold text-xl">
					{type === Type.NOTE ? "Note " : "Todo "}Modal
				</h1>
				<div className="mt-2 w-full border-slate-800 border-t-[1px] border-solid" />
				<div className="flex flex-row">
					<div className="flex flex-col p-2">
						<p>Name</p>
						<input
							value={form.name}
							onChange={(e) => {
								e.preventDefault();
								setForm({ ...form, name: e.target.value });
							}}
							className="rounded bg-transparent p-1 text-sm outline-1 outline-red-500"
						/>
					</div>
					<div className="flex flex-col p-2">
						<p>Desciption</p>
						<input
							value={form.description}
							onChange={(e) => {
								e.preventDefault();
								setForm({ ...form, description: e.target.value });
							}}
							className="rounded bg-transparent p-1 text-sm outline-1 outline-red-500"
						/>
					</div>
				</div>
				<div className="relative flex flex-row">
					<div className="flex flex-col p-2">
						<p>Status</p>
						<select
							value={form.status}
							onChange={(e) => {
								e.preventDefault();
								console.log(e.target.value);
								setForm({
									...form,
									status: Status[e.target.value as keyof typeof Status],
								});
							}}
							id="countries"
							className="block w-full rounded-lg border border-red-500 bg-slate-900 p-2.5 text-sm focus:border-red-600 focus:ring-red-600 "
						>
							{getEnumKeys(Status).map((key) => (
								<option
									className="items-center justify-center text-sm hover:bg-slate-800"
									key={key}
									value={Status[key]}
								>
									{formatStatus(Status[key])}
								</option>
							))}
						</select>
					</div>

					<div className="flex w-full flex-col items-end justify-end p-2">
						<button
							ref={buttonRef}
							className={classNames(
								"w-full rounded px-2 py-1 hover:bg-opacity-60",
								form.statusColor.color !== ""
									? `bg-${form.statusColor.color}-${form.statusColor.variant}`
									: "bg-slate-800",
								form.statusColor.variant <= 500
									? "text-slate-800"
									: "text-slate-300",
							)}
							onClick={() => setShowColors(true)}
						>
							<span
								className={classNames("flex items-center justify-center gap-2")}
							>
								Status Color
							</span>
						</button>
					</div>
				</div>
				<div className="mt-2 w-full border-slate-800 border-t-[1px] border-solid" />
				<div className="flex items-end justify-between gap-2 p-2">
					<button
						className="rounded bg-slate-800 px-2 py-1 hover:bg-slate-700"
						onClick={onClose}
					>
						Close
					</button>
					<button
						className="rounded bg-slate-800 px-2 py-1 hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-800/50 disabled:text-red-500/50"
						onClick={() => {
							const error = AssignmentSchema.safeParse(form);
							if (!error.success) {
								Toasts.error({
									title: "Error creating assignment",
									body: `Error: ${error.error.issues[0]?.message} at ${error.error.issues[0]?.path[0]} `,
								});
								console.log(error.error.message);
								return;
							}
							const { description, name, status, statusColor } = form;
							console.log(
								description,
								name,
								status,
								`${statusColor.color}-${statusColor.variant}`,
								type,
								id,
							);
							mutate({
								description,
								name,
								status,
								statusColor: `${statusColor.color}-${statusColor.variant}`,
								type: type,
								projectId: id,
							});
						}}
						disabled={isLoading}
					>
						Create
					</button>
				</div>
			</div>
			{showColors}
			<div className={classNames(showColors ? "visible" : "hidden", "")}>
				<div
					className={classNames(
						"absolute z-10 mx-2 w-full bg-slate-900 p-2 shadow outline-2 outline-slate-700/75 outline-solid",
						"top-0 left-full flex-shrink-0 items-center justify-center rounded",
					)}
					ref={ref}
				>
					<div className="grid w-full grid-cols-8 ">
						{colors.map((color) => (
							<div key={`${color}`} className="mx-auto flex flex-col gap-y-2">
								{variants.map((variant) => (
									<button
										key={`${color}-${variant}`}
										onClick={() => {
											setForm({
												...form,
												statusColor: {
													color,
													variant,
												},
											});
											setShowColors(false);
										}}
										className={classNames(
											"h-[1.5rem] w-[1.5rem] cursor-pointer rounded-full outline-2 outline-black/75 outline-solid",
											`hover:outline-${color}-${variant}/50`,
											getBgColor(color, variant),
										)}
									/>
								))}
							</div>
						))}
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default CreateModal;
