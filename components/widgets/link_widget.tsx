"use client";

// widgets/link_widget.tsx
import React, { useState, useEffect } from "react";

interface LinkWidgetProps {
	url?: string;
	displayText?: string;
	onSave?: (url: string, displayText: string) => void;
}

const LinkWidget: React.FC<LinkWidgetProps> = ({
	url: initialUrl = "",
	displayText: initialDisplayText = "",
	onSave,
}) => {
	const [url, setUrl] = useState(initialUrl);
	const [displayText, setDisplayText] = useState(initialDisplayText);
	const [isEditing, setIsEditing] = useState(!initialUrl);
	const [favicon, setFavicon] = useState<string | null>(null);
	const [faviconError, setFaviconError] = useState<boolean>(false);

	const handleSave = () => {
		if (onSave) {
			onSave(url, displayText);
		}
		setIsEditing(false);
	};

	const getFaviconUrl = (url: string) => {
		try {
			const urlObj = new URL(url);
			return `https://www.google.com/s2/favicons?sz=64&domain_url=${urlObj.hostname}`;
		} catch (e) {
			console.error("Invalid URL:", e);
			return null;
		}
	};

	useEffect(() => {
		if (url) {
			const faviconUrl = getFaviconUrl(url);
			setFavicon(faviconUrl);
			setFaviconError(false);
		}
	}, [url]);

	return (
		<div className="w-full h-full flex flex-col items-center justify-center p-2">
			{isEditing ? (
				<div className="flex flex-col items-center">
					<input
						type="text"
						value={displayText}
						onChange={(e) => setDisplayText(e.target.value)}
						placeholder="Display Text"
						className="mb-2 p-1 rounded bg-foreground/10"
					/>
					<input
						type="text"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						placeholder="URL"
						className="mb-2 p-1 rounded bg-foreground/10"
					/>
					<button
						onClick={handleSave}
						className="bg-green-500 text-white py-1 px-2 rounded"
					>
						Save
					</button>
				</div>
			) : (
				<a
					href={url}
					// target="_blank"
					// rel="noopener noreferrer"
					className="w-full h-full flex flex-col items-center justify-center gap-4"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="16px"
						viewBox="0 -960 960 960"
						width="16px"
						fill="#e8eaed"
						className="absolute top-0 right-0 m-2"
					>
						<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
					</svg>
					<img
						src={favicon || "/assets/icons/link.svg"}
						alt="Favicon"
						className="h-1/2 aspect-[1/1]"
						onError={() => setFaviconError(true)}
					/>
					<p className="w-full truncate text-center">{displayText}</p>
				</a>
			)}
		</div>
	);
};

export default LinkWidget;
