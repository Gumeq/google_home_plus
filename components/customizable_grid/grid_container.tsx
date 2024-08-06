"use client";

import React, { useState, useEffect } from "react";
import { Layout } from "react-grid-layout";
import CustomizableGrid from "./customizable_grid";
import ButtonContainer from "./button_container";
import dynamic from "next/dynamic";

const getInitialLayout = (): (Layout & { type: string; props?: any })[] => {
	if (typeof window !== "undefined") {
		const savedLayout = localStorage.getItem("grid-layout");
		return savedLayout ? JSON.parse(savedLayout) : [];
	}
	return [];
};

const GridContainer = ({ access_token }: any) => {
	const [layout, setLayout] = useState<
		(Layout & { type: string; props?: any })[]
	>(getInitialLayout());
	const [isEditable, setIsEditable] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("grid-layout", JSON.stringify(layout));
		}
	}, [layout]);

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
		setLayout([...layout, newItem]);
	};

	const handleLayoutChange = (newLayout: Layout[]) => {
		setLayout(newLayout as (Layout & { type: string; props?: any })[]);
	};

	const handleDelete = (id: string) => {
		setLayout(layout.filter((item) => item.i !== id));
	};

	const handleSaveLink = (id: string, url: string, displayText: string) => {
		setLayout(
			layout.map((item) =>
				item.i === id ? { ...item, props: { url, displayText } } : item
			)
		);
	};

	const toggleEditMode = () => {
		setIsEditable(!isEditable);
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
