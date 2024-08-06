"use client";

import React from "react";
import GridLayout, { WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import WeatherWidget from "../widgets/weather_widget";
import GoogleCalendarWidget from "../widgets/google_calendar_widget";
import YoutubeWidget from "../widgets/youtube_widget";
import LinkWidget from "../widgets/link_widget";
import GmailWidget from "../widgets/gmail_latest_widget";
import LocalNewsWidget from "../widgets/local_news_widget";

const ReactGridLayout = WidthProvider(GridLayout);

interface CustomizableGridProps {
	layout: (Layout & { type: string; props?: any })[];
	onLayoutChange: (
		layout: (Layout & { type: string; props?: any })[]
	) => void;
	isEditable: boolean;
	onDelete: (id: string) => void;
	access_token: string;
	handleSaveLink: (id: string, url: string, displayText: string) => void;
}

const CustomizableGrid: React.FC<CustomizableGridProps> = ({
	layout,
	onLayoutChange,
	isEditable,
	onDelete,
	access_token,
	handleSaveLink,
}) => {
	const resizeHandles: any[] = ["se", "sw", "ne", "nw", "s", "w", "n", "e"];

	const renderWidget = (type: string, props?: any) => {
		switch (type) {
			case "weather":
				return <WeatherWidget />;
			case "local_news":
				return <LocalNewsWidget />;
			case "calendar":
				return <GoogleCalendarWidget access_token={access_token} />;
			case "gmail_latest":
				return <GmailWidget access_token={access_token} />;
			case "youtube":
				return <YoutubeWidget access_token={access_token} />;
			case "link":
				return (
					<LinkWidget
						{...props}
						onSave={(url: string, displayText: string) =>
							handleSaveLink(props.i, url, displayText)
						}
					/>
				);
			default:
				return <div>Unknown Widget</div>;
		}
	};

	return (
		<ReactGridLayout
			className="layout no-animation"
			layout={layout}
			cols={16}
			rowHeight={100}
			width={1600}
			onLayoutChange={(newLayout) =>
				onLayoutChange(
					newLayout.map((item) => {
						const currentItem = layout.find((l) => l.i === item.i);
						return {
							...item,
							type: currentItem?.type ?? "unknown",
							props: currentItem?.props ?? {}, // Pass existing props if any
						};
					})
				)
			}
			isDraggable={isEditable}
			isResizable={isEditable}
			resizeHandles={resizeHandles}
		>
			{layout.map((item) => (
				<div
					key={item.i}
					data-grid={item}
					className="relative bg-foreground/10 p-2 rounded-xl drop-shadow-lg overflow-hidden"
				>
					{isEditable && (
						<button
							className="absolute top-2 right-2 text-white p-1 rounded z-20"
							onClick={() => onDelete(item.i)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="24px"
								viewBox="0 -960 960 960"
								width="24px"
								fill="#e8eaed"
							>
								<path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
							</svg>
						</button>
					)}
					<div
						className={`w-full h-full flex items-center justify-center ${
							isEditable ? "cursor-move" : ""
						}`}
						style={{ pointerEvents: isEditable ? "none" : "auto" }}
					>
						{renderWidget(item.type, { ...item.props, i: item.i })}
					</div>
				</div>
			))}
		</ReactGridLayout>
	);
};

export default CustomizableGrid;
