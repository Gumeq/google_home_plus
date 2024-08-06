import React from "react";
import EditButton from "./edit_button";
import AddWidgetsButton from "./add_widgets_button";

interface ButtonContainerProps {
	isEditable: boolean;
	toggleEditMode: () => void;
	addWidget: (type: string, size: { w: number; h: number }) => void;
}

const ButtonContainer: React.FC<ButtonContainerProps> = ({
	isEditable,
	toggleEditMode,
	addWidget,
}) => {
	return (
		<div className="fixed bottom-4 right-4 mx-4 flex space-x-2 flex-row">
			<EditButton
				isEditable={isEditable}
				toggleEditMode={toggleEditMode}
			/>
			<AddWidgetsButton
				options={[
					{
						label: "Add Gmail Widget",
						image_url: "/assets/icons/gmail_icon.svg",
						onClick: () =>
							addWidget("gmail_latest", { w: 4, h: 4 }),
					},
					{
						label: "Add Google Calendar Widget",
						image_url: "/assets/icons/google_calendar_icon.svg",
						onClick: () => addWidget("calendar", { w: 4, h: 4 }),
					},
					{
						label: "Add YouTube Widget",
						image_url: "/assets/icons/youtube_icon.svg",
						onClick: () => addWidget("youtube", { w: 4, h: 4 }),
					},
					{
						label: "Add Local News Widget",
						image_url: "/assets/icons/news_icon.svg",
						onClick: () => addWidget("local_news", { w: 6, h: 4 }),
					},
					{
						label: "Add Weather Widget",
						image_url: "/assets/icons/weather_icon.svg",
						onClick: () => addWidget("weather", { w: 2, h: 2 }),
					},
					{
						label: "Add Link",
						image_url: "/assets/icons/link.svg",
						onClick: () => addWidget("link", { w: 2, h: 2 }),
					},
				]}
			/>
		</div>
	);
};

export default ButtonContainer;
