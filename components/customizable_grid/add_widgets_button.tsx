import React, { useState } from "react";

interface DropdownButtonProps {
	options: { label: string; image_url?: string; onClick: () => void }[];
}

const AddWidgetsButton: React.FC<DropdownButtonProps> = ({ options }) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="">
			<button
				className="bg-foreground/10 px-4 py-2 rounded-full shadow-lg"
				onClick={toggleDropdown}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 -960 960 960"
					width="24px"
					fill="#0000000"
					className="svg-foreground"
				>
					<path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
				</svg>
			</button>
			{isOpen && (
				<div className="absolute bottom-full mb-2 w-[300px] -left-1/4  transform -translate-x-1/2 bg-foreground/10 rounded shadow-lg flex flex-col">
					{options.map((option, index) => (
						<button
							key={index}
							className="px-4 py-2  hover:bg-foreground/20 w-full text-left flex flex-row items-center justify-between"
							onClick={() => {
								option.onClick();
								setIsOpen(false);
							}}
						>
							<p>{option.label}</p>
							<img
								src={option.image_url}
								alt="img"
								className="h-6 w-6"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default AddWidgetsButton;
