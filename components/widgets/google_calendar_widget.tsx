"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { createClient } from "@/utils/supabase/client";
import fetchCalendarEvents from "@/utils/google_api/fetch_google_calendar_data";

const calendarColors = {
	"1": "#7986CB", // Lavender (Modern)
	"2": "#33B679", // Sage (Modern)
	"3": "#8E24AA", // Grape (Modern)
	"4": "#E67C73", // Flamingo (Modern)
	"5": "#F6BF26", // Banana (Modern)
	"6": "#F4511E", // Tangerine (Modern)
	"7": "#039BE5", // Peacock (Modern)
	"8": "#616161", // Graphite (Modern)
	"9": "#3F51B5", // Blueberry (Modern)
	"10": "#0B8043", // Basil (Modern)
	"11": "#D50000", // Tomato (Modern)
} as const;

type CalendarColorId = keyof typeof calendarColors;

interface CalendarEvent {
	id: string;
	summary: string;
	start: { dateTime?: string; date?: string };
	colorId?: CalendarColorId;
}

const getEventColor = (event: CalendarEvent) => {
	const colorId = event.colorId;
	return colorId ? calendarColors[colorId] : "#000000"; // Default to black if colorId is not found
};

interface GoogleCalendarWidgetProps {
	access_token: string;
}

const GoogleCalendarWidget: React.FC<GoogleCalendarWidgetProps> = ({
	access_token,
}) => {
	const [events, setEvents] = useState<CalendarEvent[]>([]);
	const [user, setUser] = useState<any | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [maxEvents, setMaxEvents] = useState<number>(15);

	const containerRef = useRef<HTMLDivElement>(null);
	const eventRef = useRef<HTMLLIElement>(null);

	const debounce = (func: any, wait: any) => {
		let timeout: any;
		return (...args: any) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	};

	const calculateMaxEvents = useCallback(() => {
		if (containerRef.current && eventRef.current) {
			const containerHeight = containerRef.current.clientHeight;
			const eventHeight = eventRef.current.clientHeight;

			// Get the computed style for the event element to include margins
			const eventStyle = window.getComputedStyle(eventRef.current);
			const eventMargin =
				parseFloat(eventStyle.marginTop) +
				parseFloat(eventStyle.marginBottom);

			// Calculate the total height of an event including margins
			const totalEventHeight = eventHeight + eventMargin;

			// Calculate the max number of events that can fit in the container
			const maxEvents = Math.floor(containerHeight / totalEventHeight);
			setMaxEvents(maxEvents);
		}
	}, []);

	useEffect(() => {
		if (maxEvents > 0) {
			const fetchData = async () => {
				setLoading(true);
				try {
					const supabase = createClient();
					const { data: user, error } = await supabase.auth.getUser();

					if (error || !user) {
						console.error("Error fetching user:", error);
						return;
					}

					setUser(user.user);
					const calendarEvents = await fetchCalendarEvents(
						access_token,
						maxEvents
					);

					if (calendarEvents) {
						setEvents(calendarEvents);
					}
				} catch (error) {
					console.error("Error fetching data:", error);
				} finally {
					setLoading(false);
				}
			};

			fetchData();
		}
	}, [maxEvents, access_token]);

	useEffect(() => {
		calculateMaxEvents();
		const handleResize = debounce(calculateMaxEvents, 100);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [calculateMaxEvents]);

	const formatDate = (date: string) => {
		const options: Intl.DateTimeFormatOptions = {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		};
		return new Date(date).toLocaleDateString("en-GB", options);
	};

	const groupEventsByDate = (events: CalendarEvent[]) => {
		return events.reduce((groups, event) => {
			const date = event.start.dateTime || event.start.date;
			if (!date) return groups;
			const formattedDate = formatDate(date);
			if (!groups[formattedDate]) {
				groups[formattedDate] = [];
			}
			groups[formattedDate].push(event);
			return groups;
		}, {} as { [key: string]: CalendarEvent[] });
	};

	const groupedEvents = groupEventsByDate(events);

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
							width={150}
							height={24}
							baseColor="#4F4F4F"
							highlightColor="#636363"
						/>
					</div>
					<div className="w-full overflow-y-auto">
						{Array.from({ length: maxEvents }).map((_, index) => (
							<div
								key={index}
								className="flex flex-row gap-4 w-full pr-2 mb-4"
							>
								<Skeleton
									width={80}
									height={24}
									baseColor="#4F4F4F"
									highlightColor="#636363"
								/>
								<div className="flex flex-col w-full">
									<Skeleton
										width={`100%`}
										height={20}
										baseColor="#4F4F4F"
										highlightColor="#636363"
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			) : user ? (
				<a
					className="flex flex-col overflow-y-auto custom-scrollbar"
					href="https://calendar.google.com/"
				>
					<div className="w-full h-8 pb-2 mb-2 border-b border-foreground/20 flex flex-row items-center gap-2">
						<svg
							version="1.1"
							xmlns="http://www.w3.org/2000/svg"
							x="0px"
							y="0px"
							viewBox="0 0 200 200"
							className="h-full"
						>
							<g transform="translate(3.75 3.75)">
								<path
									fill="#FFFFFF"
									d="M148.882,43.618l-47.368-5.263l-57.895,5.263L38.355,96.25l5.263,52.632l52.632,6.579l52.632-6.579l5.263-53.947L148.882,43.618z"
								/>
								<path
									fill="#1A73E8"
									d="M65.211,125.276c-3.934-2.658-6.658-6.539-8.145-11.671l9.132-3.763c0.829,3.158,2.276,5.605,4.342,7.342c2.053,1.737,4.553,2.592,7.474,2.592c2.987,0,5.553-0.908,7.697-2.724s3.224-4.132,3.224-6.934c0-2.868-1.132-5.211-3.395-7.026s-5.105-2.724-8.5-2.724h-5.276v-9.039H76.5c2.921,0,5.382-0.789,7.382-2.368c2-1.579,3-3.737,3-6.487c0-2.447-0.895-4.395-2.684-5.855s-4.053-2.197-6.803-2.197c-2.684,0-4.816,0.711-6.395,2.145s-2.724,3.197-3.447,5.276l-9.039-3.763c1.197-3.395,3.395-6.395,6.618-8.987c3.224-2.592,7.342-3.895,12.342-3.895c3.697,0,7.026,0.711,9.974,2.145c2.947,1.434,5.263,3.421,6.934,5.947c1.671,2.539,2.5,5.382,2.5,8.539c0,3.224-0.776,5.947-2.329,8.184c-1.553,2.237-3.461,3.947-5.724,5.145v0.539c2.987,1.25,5.421,3.158,7.342,5.724c1.908,2.566,2.868,5.632,2.868,9.211s-0.908,6.776-2.724,9.579c-1.816,2.803-4.329,5.013-7.513,6.618c-3.197,1.605-6.789,2.421-10.776,2.421C73.408,129.263,69.145,127.934,65.211,125.276z"
								/>
								<path
									fill="#1A73E8"
									d="M121.25,79.961l-9.974,7.25l-5.013-7.605l17.987-12.974h6.895v61.197h-9.895L121.25,79.961z"
								/>
								<path
									fill="#EA4335"
									d="M148.882,196.25l47.368-47.368l-23.684-10.526l-23.684,10.526l-10.526,23.684L148.882,196.25z"
								/>
								<path
									fill="#34A853"
									d="M33.092,172.566l10.526,23.684h105.263v-47.368H43.618L33.092,172.566z"
								/>
								<path
									fill="#4285F4"
									d="M12.039-3.75C3.316-3.75-3.75,3.316-3.75,12.039v136.842l23.684,10.526l23.684-10.526V43.618h105.263l10.526-23.684L148.882-3.75H12.039z"
								/>
								<path
									fill="#188038"
									d="M-3.75,148.882v31.579c0,8.724,7.066,15.789,15.789,15.789h31.579v-47.368H-3.75z"
								/>
								<path
									fill="#FBBC04"
									d="M148.882,43.618v105.263h47.368V43.618l-23.684-10.526L148.882,43.618z"
								/>
								<path
									fill="#1967D2"
									d="M196.25,43.618V12.039c0-8.724-7.066-15.789-15.789-15.789h-31.579v47.368H196.25z"
								/>
							</g>
						</svg>
						<h1 className="text-lg">Google Calendar</h1>
					</div>
					<div className="w-full overflow-y-auto">
						{Object.keys(groupedEvents).map((date) => (
							<div
								key={date}
								className="flex flex-row gap-4 w-full pr-2"
							>
								<h4 className="">{date.slice(0, 5)}</h4>
								<ul className="flex flex-col w-full">
									{groupedEvents[date]
										.slice(0, maxEvents)
										.map((event, index) => (
											<li
												key={event.id}
												className={`w-full rounded-md mb-2 p-1 flex flex-row gap-2 items-center hover:bg-foreground/10`}
												ref={
													index === 0
														? eventRef
														: null
												}
											>
												<div
													className="w-2 h-2 rounded-full"
													style={{
														backgroundColor:
															getEventColor(
																event
															),
													}}
												></div>
												<p className="">
													{event.summary}
												</p>
											</li>
										))}
								</ul>
							</div>
						))}
					</div>
				</a>
			) : (
				<p>No calendar data</p>
			)}
		</div>
	);
};

export default React.memo(GoogleCalendarWidget);
