"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Layout } from "react-grid-layout";
import dynamic from "next/dynamic";
import debounce from "lodash.debounce";

// Dynamic import for child components
const CustomizableGrid = dynamic(() => import("./customizable_grid"), {
	ssr: false,
});
const ButtonContainer = dynamic(() => import("./button_container"), {
	ssr: false,
});

// Utility function to get initial layout from localStorage
const getInitialLayout = (): (Layout & { type: string; props?: any })[] => {
	if (typeof window !== "undefined") {
		const savedLayout = localStorage.getItem("grid-layout");
		return savedLayout ? JSON.parse(savedLayout) : [];
	}
	return [];
};

// Props type definition
interface GridContainerProps {
	access_token: string;
}

// Main component
const GridContainer: React.FC<GridContainerProps> = ({ access_token }) => {
	const [layout, setLayout] = useState<
		(Layout & { type: string; props?: any })[]
	>(getInitialLayout());
	const [isEditable, setIsEditable] = useState(false);

	// Memoized function to save layout to localStorage with debounce
	const saveLayout = useCallback(
		debounce((newLayout: any) => {
			localStorage.setItem("grid-layout", JSON.stringify(newLayout));
		}, 500),
		[]
	);

	useEffect(() => {
		if (typeof window !== "undefined") {
			saveLayout(layout);
		}
	}, [layout, saveLayout]);

	// Function to add a new widget to the grid
	const addWidget = (type: string, size: { w: number; h: number }) => {
		const newItem: Layout & { type: string; props?: any } = {
			i: new Date().getTime().toString(),
			x: 0,
			y: Infinity, // places it at the bottom
			w: size.w,
			h: size.h,
			type: type,
			props: {}, // Initialize props object
		};
		setLayout((prevLayout) => [...prevLayout, newItem]);
	};

	// Function to handle layout change
	const handleLayoutChange = (newLayout: Layout[]) => {
		setLayout(newLayout as (Layout & { type: string; props?: any })[]);
	};

	// Function to delete a widget
	const handleDelete = (id: string) => {
		setLayout((prevLayout) => prevLayout.filter((item) => item.i !== id));
	};

	// Function to save link data to a widget
	const handleSaveLink = (id: string, url: string, displayText: string) => {
		setLayout((prevLayout) =>
			prevLayout.map((item) =>
				item.i === id ? { ...item, props: { url, displayText } } : item
			)
		);
	};

	// Function to toggle edit mode
	const toggleEditMode = () => {
		setIsEditable((prevIsEditable) => !prevIsEditable);
	};

	return (
		<div className="p-4 w-full">
			<div className="mb-4">
				<CustomizableGrid
					layout={layout}
					onLayoutChange={handleLayoutChange}
					isEditable={isEditable}
					onDelete={handleDelete}
					access_token={access_token}
					handleSaveLink={handleSaveLink}
				/>
			</div>
			<ButtonContainer
				isEditable={isEditable}
				toggleEditMode={toggleEditMode}
				addWidget={addWidget}
			/>
		</div>
	);
};

export default dynamic(() => Promise.resolve(GridContainer), { ssr: false });
