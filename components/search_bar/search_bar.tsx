"use client";

import React, { useState } from "react";

const SearchBar: React.FC = () => {
	const [query, setQuery] = useState("");

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (query.trim()) {
			window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
				query
			)}`;
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="h-10 w-[480px] bg-white rounded-full flex flex-row items-center drop-shadow-lg"
		>
			<button
				type="submit"
				className="h-full w-[10%] flex items-center justify-center opacity-50"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 -960 960 960"
					width="24px"
					className="m-2"
					fill="black"
				>
					<path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
				</svg>
			</button>
			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search Google"
				className="w-full h-full bg-transparent outline-none text-background px-2"
			/>
		</form>
	);
};

export default SearchBar;
