"use client";
import { signOut } from "@/utils/supabase/logout";
import React, { useState, useRef, useEffect } from "react";
import ThemeSwitchButton from "../theme_button/theme_button";

const UserAvatar: React.FC<{ user: any }> = ({ user }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleToggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node)
		) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleSignOut = async () => {
		await signOut();
	};

	return (
		<div className="relative inline-block h-full">
			<img
				src={user.user?.user_metadata.avatar_url}
				alt="User Avatar"
				className="h-full rounded-full aspect-[1/1] mr-1 cursor-pointer"
				onClick={handleToggleDropdown}
			/>
			{isOpen && (
				<div
					ref={dropdownRef}
					className="absolute right-0 mt-2 w-48 bg-foreground/10 rounded-md shadow-lg z-10"
				>
					<div className="py-2">
						<a
							href="/settings"
							className="block px-4 py-2 hover:bg-foreground/20"
						>
							Settings
						</a>
						<button
							onClick={handleSignOut}
							className="block w-full text-left px-4 py-2  hover:bg-foreground/20"
						>
							Log Out
						</button>
						<div className="flex items-center w-full px-4 py-2 hover:bg-foreground/20">
							<ThemeSwitchButton></ThemeSwitchButton>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default UserAvatar;
