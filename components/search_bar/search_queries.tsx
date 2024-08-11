"use client";
import {
	Combobox,
	ComboboxButton,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
	Transition,
} from "@headlessui/react";
import clsx from "clsx";
import { useState, ChangeEvent, useEffect, useCallback } from "react";
import Link from "next/link";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import {
	addQuery,
	fetchLatestQueries,
} from "@/utils/supabase/functions/fetch_search_queries";

const SearchQueries = ({ media, setMedia, link, user_id }: any) => {
	const [query, setQuery] = useState<string>("");
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();

	const debouncedSearch = useCallback(
		debounce(async (query: string) => {
			setLoading(true);
			try {
				const result = await fetchLatestQueries(user_id, query);
				setData(result);
			} catch (err) {
				console.error("Failed to fetch data", err);
			} finally {
				setLoading(false);
			}
		}, 300),
		[]
	);

	useEffect(() => {
		if (query) {
			debouncedSearch(query);
		} else {
			setData(null);
		}
	}, [query, debouncedSearch]);

	const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);
	};

	const handleSelect = async (selected: any) => {
		if (query !== null && query.length > 0) {
			setQuery(selected.query);
			await addQuery(user_id, selected.query);
			router.push(
				`https://www.google.com/search?q=${encodeURIComponent(
					selected.query
				)}`
			);
		}
	};

	const renderOptions = useCallback(() => {
		const options = [
			{ id: "current-query", query: query },
			...(data || []),
		];

		if (loading) {
			return <div className="text-sm/6 text-white">Loading...</div>;
		}

		return options.slice(0, 10).map((item: any) => (
			<ComboboxOption
				key={item.id}
				value={item}
				className="group flex items-center gap-4 py-1.5 px-3 select-none data-[focus]:bg-black/10"
			>
				<div className="text-sm/6 text-black flex flex-row gap-2">
					<img
						src={"/assets/icons/search.svg"}
						alt={""}
						width={20}
						height={20}
						className="invert-on-dark opacity-70"
					/>
					{item.id === "current-query" ? query : item.query}
				</div>
			</ComboboxOption>
		));
	}, [data, loading, query]);

	return (
		<div className="w-full max-w-[480px]">
			<Combobox value={query} onChange={handleSelect}>
				<div className="relative">
					<ComboboxInput
						className={clsx(
							"w-full bg-white rounded-full pl-10 pr-3 text-sm/6 text-background h-10",
							"focus:outline-none focus:drop-shadow-xl data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-foreground/25"
						)}
						displayValue={(query: any) => query?.query}
						onChange={handleQueryChange}
						placeholder="Search Google"
					/>
					<ComboboxButton className="group absolute inset-y-0 left-0 px-2">
						<img
							src={"/assets/icons/search.svg"}
							alt={""}
							width={20}
							height={20}
							className="invert-on-dark opacity-70"
						/>
					</ComboboxButton>
				</div>
				<Transition
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					afterLeave={() => setQuery("")}
				>
					<ComboboxOptions
						anchor="bottom"
						className="w-[var(--input-width)] z-40 rounded-[16px] border border-white/5 bg-white text-black/80 drop-shadow-xl mt-2 [--anchor-gap:var(--spacing-1)] empty:hidden"
					>
						{renderOptions()}
					</ComboboxOptions>
				</Transition>
			</Combobox>
		</div>
	);
};

export default SearchQueries;
