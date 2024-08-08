"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import md5 from "md5";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Email {
	id: string;
	snippet: string;
	internalDate: string;
	subject: string;
	from: string;
	isUnread: boolean;
}

interface GmailWidgetProps {
	access_token: string;
}

const GmailWidget: React.FC<GmailWidgetProps> = ({ access_token }) => {
	const [emails, setEmails] = useState<Email[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [maxEmails, setMaxEmails] = useState<number>(10);

	const containerRef = useRef<HTMLDivElement>(null);
	const emailRef = useRef<HTMLLIElement>(null);

	const calculateMaxEmails = useCallback(() => {
		if (containerRef.current && emailRef.current) {
			const containerHeight = containerRef.current.clientHeight;
			const emailHeight = emailRef.current.clientHeight;

			const emailStyle = window.getComputedStyle(emailRef.current);
			const emailMargin =
				parseFloat(emailStyle.marginTop) +
				parseFloat(emailStyle.marginBottom);

			const totalEmailHeight = emailHeight + emailMargin;

			const maxEmails = Math.floor(containerHeight / totalEmailHeight);
			setMaxEmails(maxEmails);
		}
	}, []);

	const debounce = (func: any, wait: any) => {
		let timeout: any;
		return (...args: any) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	};

	useEffect(() => {
		const fetchEmails = async () => {
			if (maxEmails > 0) {
				setLoading(true);
				try {
					const response = await fetch(
						`/api/gmail_latest?accessToken=${access_token}&maxResults=${maxEmails}`
					);
					if (!response.ok) {
						throw new Error(
							`Error fetching emails: ${response.statusText}`
						);
					}
					const data = await response.json();
					setEmails(data.emails);
					console.log(emails);
				} catch (error) {
					console.error("Error fetching data:", error);
				} finally {
					setLoading(false);
				}
			}
		};

		fetchEmails();
	}, [maxEmails, access_token]);

	useEffect(() => {
		calculateMaxEmails();
		const handleResize = debounce(calculateMaxEmails, 100);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [calculateMaxEmails]);

	const getGravatarUrl = (email: string) => {
		const hash = md5(email.trim().toLowerCase());
		return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
	};

	const extractName = (from: string): string => {
		const nameMatch = from.match(/(.*)<.*>/);
		return nameMatch ? nameMatch[1].trim() : from;
	};

	return (
		<div
			ref={containerRef}
			className="w-full h-full flex flex-col p-2 text-foreground"
		>
			{loading ? (
				<div className="flex flex-col overflow-y-auto custom-scrollbar">
					<div className="w-full h-8 pb-2 mb-2 border-b border-foreground/20 flex flex-row items-center gap-2">
						<Skeleton
							circle
							width={32}
							height={32}
							baseColor="#4F4F4F"
							highlightColor="#636363"
						/>
						<Skeleton
							width={100}
							height={24}
							baseColor="#4F4F4F"
							highlightColor="#636363"
						/>
					</div>
					<ul className="flex flex-col w-full pr-2 overflow-y-auto">
						{Array.from({ length: maxEmails }).map((_, index) => (
							<li
								key={index}
								className="w-full p-2 rounded-md mb-2 flex flex-row gap-4 relative"
							>
								<Skeleton
									circle
									width={32}
									height={32}
									baseColor="#4F4F4F"
									highlightColor="#636363"
								/>
								<div className="flex flex-col w-full">
									<Skeleton
										width={150}
										height={20}
										baseColor="#4F4F4F"
										highlightColor="#636363"
									/>
									<Skeleton
										width={`80%`}
										height={20}
										baseColor="#4F4F4F"
										highlightColor="#636363"
									/>
									<Skeleton
										width={`60%`}
										height={20}
										baseColor="#4F4F4F"
										highlightColor="#636363"
									/>
								</div>
							</li>
						))}
					</ul>
				</div>
			) : (
				<div className="flex flex-col overflow-y-auto custom-scrollbar">
					<a
						className="w-full h-8 pb-2 mb-2 border-b border-foreground/20 flex flex-row items-center gap-2"
						href={"https://mail.google.com/"}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="52 42 88 66"
							className="h-full"
						>
							<path
								fill="#4285f4"
								d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6"
							/>
							<path
								fill="#34a853"
								d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15"
							/>
							<path
								fill="#fbbc04"
								d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2"
							/>
							<path
								fill="#ea4335"
								d="M72 74V48l24 18 24-18v26L96 92"
							/>
							<path
								fill="#c5221f"
								d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2"
							/>
						</svg>
						<h1 className="text-lg">Gmail</h1>
					</a>
					<ul className="flex flex-col w-full pr-2 overflow-y-auto">
						{emails.map((email, index) => (
							<a
								key={email.id}
								className={`w-full p-2 rounded-md mb-2 flex flex-row gap-4 relative hover:bg-foreground/10`}
								href={`https://mail.google.com/mail/u/0/#inbox/${email.id}`}
							>
								<div className="absolute top-0 right-0 m-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										height="16px"
										viewBox="0 -960 960 960"
										width="16px"
										fill="#e8eaed"
									>
										<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
									</svg>
								</div>
								<div className="min-w-8 min-h-8">
									{email.from.includes("<") &&
										email.from.includes(">") && (
											<img
												src={getGravatarUrl(
													email.from.match(
														/<(.+)>/
													)?.[1] || ""
												)}
												alt="Sender's Avatar"
												className="rounded-full w-8 h-8"
											/>
										)}
								</div>
								<div className="h-full">
									<p className="font-bold">
										{extractName(email.from)}{" "}
										<span className="font-normal text-foreground/50">
											{email.isUnread ? "New" : ""}
										</span>
									</p>
									<p className="font-bold">{email.subject}</p>
									<p className="line-clamp-2">
										{email.snippet}{" "}
									</p>
								</div>
							</a>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default GmailWidget;
