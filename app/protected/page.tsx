import dynamic from "next/dynamic";
import Link from "next/link";
import React, { Suspense } from "react";
import { refreshAccessToken } from "@/utils/google_api/refresh_token";
import { createClient } from "@/utils/supabase/server";

const GridContainer = dynamic(
	() => import("@/components/customizable_grid/grid_container")
);
const SearchBar = dynamic(() => import("@/components/search_bar/search_bar"));
const UserAvatar = dynamic(
	() => import("@/components/user_avatar/user_avatar")
);

const page = async () => {
	const supabase = createClient();
	const { data: user } = await supabase.auth.getUser();
	if (!user.user) {
		console.log(user);
		return;
	}
	const { data: tokens } = await supabase
		.from("user_tokens")
		.select("*")
		.eq("user_id", user.user.id)
		.single();

	if (!tokens) {
		return;
	}
	const refresh_token = tokens.refresh_token;
	const refreshTokenResponse = await refreshAccessToken(
		tokens.refresh_token,
		user.user.id,
		tokens.expiry_date
	);

	if (refreshTokenResponse) {
		const { access_token, expires_in } = refreshTokenResponse;
		console.log("Expires in (seconds):", expires_in);
		// Do something with the new access token if needed
	} else {
		console.log("Access token is still valid.");
	}
	return (
		<div className="w-screen h-screen overflow-y-auto custom-scrollbar">
			<nav className="w-full h-14 p-2 flex justify-end items-center">
				<div className="h-full pr-1 pl-8 flex flex-row gap-4 items-center text-sm font-normal">
					<Link
						href={"https://mail.google.com/"}
						className="hover:underline"
					>
						Gmail
					</Link>
					<Link
						href={
							"https://www.google.com/imghp?hl=en&tab=ri&authuser=0&ogbl"
						}
						className="hover:underline"
					>
						Images
					</Link>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 -960 960 960"
						width="24px"
						className="svg-foreground"
						fill="#0000000"
					>
						<path d="M240-160q-33 0-56.5-23.5T160-240q0-33 23.5-56.5T240-320q33 0 56.5 23.5T320-240q0 33-23.5 56.5T240-160Zm240 0q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm240 0q-33 0-56.5-23.5T640-240q0-33 23.5-56.5T720-320q33 0 56.5 23.5T800-240q0 33-23.5 56.5T720-160ZM240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400ZM240-640q-33 0-56.5-23.5T160-720q0-33 23.5-56.5T240-800q33 0 56.5 23.5T320-720q0 33-23.5 56.5T240-640Zm240 0q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Zm240 0q-33 0-56.5-23.5T640-720q0-33 23.5-56.5T720-800q33 0 56.5 23.5T800-720q0 33-23.5 56.5T720-640Z" />
					</svg>
					<Suspense fallback={<div>Loading...</div>}>
						<UserAvatar user={user} />
					</Suspense>
				</div>
			</nav>
			<section className="max-w-[1650px] w-screen h-screen mx-auto p-2 flex flex-col gap-8">
				<div className="w-full flex flex-col items-center gap-8">
					<h1 className="text-2xl">
						Welcome, {user.user?.user_metadata.name.split(" ")[0]}!
					</h1>
					<Suspense fallback={<div>Loading...</div>}>
						<SearchBar />
					</Suspense>
				</div>
				<Suspense fallback={<div>Loading...</div>}>
					<GridContainer access_token={tokens.provider_token} />
				</Suspense>
			</section>
		</div>
	);
};

export default page;
