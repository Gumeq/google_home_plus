"use client";

import { useEffect, useState } from "react";
import { markAsUntransferable } from "worker_threads";

interface Video {
	title: string;
	videoId: string;
	publishedAt: string;
}

const YoutubeWidget = ({ access_token }: any) => {
	const [videos, setVideos] = useState<Video[]>([]);

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				const response = await fetch(
					`/api/youtube_videos?accessToken=${access_token}&maxResults=5`
				);
				if (!response.ok) {
					throw new Error(
						`Error fetching videos: ${response.statusText}`
					);
				}
				const data = await response.json();
				setVideos(data.videos);
			} catch (error) {
				console.error("Error fetching videos:", error);
			}
		};

		fetchVideos();
	}, [access_token]);

	return (
		<div className="w-full h-full flex flex-col overflow-y-auto">
			<div className="w-full h-8 pb-2 mb-2 border-b border-foreground/20 flex flex-row items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-full"
					viewBox="0 0 28.57  20"
					focusable="false"
				>
					<svg
						viewBox="0 0 28.57 20"
						preserveAspectRatio="xMidYMid meet"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g>
							<path
								d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z"
								fill="#FF0000"
							></path>
							<path
								d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z"
								fill="white"
							></path>
						</g>
					</svg>
				</svg>
				<h1 className="text-lg">Latest Video</h1>
			</div>
			{/* <div className="h-full">
				<iframe
					allowFullScreen
					src="https://www.youtube.com/embed/k3jDxPXZuPE"
					title="We’re all being played and I’m tired of it"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					className="rounded-lg overflow-hidden w-full h-full"
				></iframe>
			</div> */}
			<div className="w-full overflow-y-auto h-full flex flex-col gap-2 pr-2 custom-scrollbar">
				{videos.map((video, index) => (
					<div key={index}>
						<iframe
							allowFullScreen
							src={`https://www.youtube.com/embed/${video.videoId}`}
							title={video.title}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							className="rounded-lg overflow-hidden w-full aspect-[16/9]"
						></iframe>
						{/* <a
							href={`https://www.youtube.com/watch?v=${video.videoId}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							{video.title}
						</a>
						<p>{new Date(video.publishedAt).toLocaleString()}</p> */}
					</div>
				))}
			</div>
		</div>
	);
};
export default YoutubeWidget;
