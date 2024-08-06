"use client";

import React, { useEffect, useState } from "react";
import { fetchNews } from "@/services/news_service";
import { fetchGeolocation } from "@/services/geolocation_service";

const LocalNewsWidget: React.FC = () => {
	const [news, setNews] = useState<any[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [country, setCountry] = useState<string | null>(null);

	useEffect(() => {
		const getGeolocationAndNews = async () => {
			try {
				const geolocationData = await fetchGeolocation();
				setCountry(geolocationData.countryCode);
				const newsData = await fetchNews(geolocationData.countryCode);
				setNews(newsData);
				console.log(newsData);
			} catch (error) {
				setError("Failed to fetch news data");
			}
		};

		getGeolocationAndNews();
	}, []);

	if (error) {
		return (
			<div className="w-full h-full flex items-center justify-center text-black bg-red-200">
				{error}
			</div>
		);
	}

	if (news.length === 0) {
		return (
			<div className="w-full h-full flex items-center justify-center text-foreground">
				Loading...
			</div>
		);
	}

	return (
		<div className="w-full h-full flex flex-col items-center text-foreground overflow-y-auto">
			<div className="w-full h-8 pb-2 mb-2 border-b border-foreground/20 flex flex-row items-center gap-2">
				<svg
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					x="0"
					y="0"
					viewBox="0 0 6550.8 5359.7"
					className="h-full"
				>
					<path
						fill="#0C9D58"
						d="M5210.8 3635.7c0 91.2-75.2 165.9-167.1 165.9H1507c-91.9 0-167.1-74.7-167.1-165.9V165.9C1339.9 74.7 1415.1 0 1507 0h3536.8c91.9 0 167.1 74.7 167.1 165.9v3469.8z"
					/>
					<polygon
						opacity=".2"
						fill="#004D40"
						points="5210.8,892 3885.3,721.4 5210.8,1077"
					/>
					<path
						opacity=".2"
						fill="#004D40"
						d="M3339.3 180.9L1332 1077.2l2218.5-807.5v-2.2c-39-83.6-134-122.6-211.2-86.6z"
					/>
					<path
						opacity=".2"
						fill="#FFFFFF"
						d="M5043.8 0H1507c-91.9 0-167.1 74.7-167.1 165.9v37.2c0-91.2 75.2-165.9 167.1-165.9h3536.8c91.9 0 167.1 74.7 167.1 165.9v-37.2C5210.8 74.7 5135.7 0 5043.8 0z"
					/>
					<path
						fill="#EA4335"
						d="M2198.2 3529.1c-23.9 89.1 23.8 180 106 202l3275.8 881c82.2 22 169-32.9 192.8-122l771.7-2880c23.9-89.1-23.8-180-106-202l-3275.8-881c-82.2-22-169 32.9-192.8 122l-771.7 2880z"
					/>
					<polygon
						opacity=".2"
						fill="#3E2723"
						points="5806.4,2638.1 5978.7,3684.8 5806.4,4328.1"
					/>
					<polygon
						opacity=".2"
						fill="#3E2723"
						points="3900.8,764.1 4055.2,805.6 4151,1451.6"
					/>
					<path
						opacity=".2"
						fill="#FFFFFF"
						d="M6438.6 1408.1l-3275.8-881c-82.2-22-169 32.9-192.8 122l-771.7 2880c-1.3 4.8-1.6 9.7-2.5 14.5l765.9-2858.2c23.9-89.1 110.7-144 192.8-122l3275.8 881c77.7 20.8 123.8 103.3 108.5 187.6l5.9-21.9c23.8-89.1-23.9-180-106.1-202z"
					/>
					<path
						fill="#FFC107"
						d="M4778.1 3174.4c31.5 86.7-8.1 181.4-88 210.5L1233.4 4643c-80 29.1-171.2-18-202.7-104.7L10.9 1736.5c-31.5-86.7 8.1-181.4 88-210.5L3555.6 267.9c80-29.1 171.2 18 202.7 104.7l1019.8 2801.8z"
					/>
					<path
						opacity=".2"
						fill="#FFFFFF"
						d="M24 1771.8c-31.5-86.7 8.1-181.4 88-210.5L3568.7 303.1c79.1-28.8 169 17.1 201.5 102l-11.9-32.6c-31.6-86.7-122.8-133.8-202.7-104.7L98.9 1526c-80 29.1-119.6 123.8-88 210.5l1019.8 2801.8c.3.9.9 1.7 1.3 2.7L24 1771.8z"
					/>
					<path
						fill="#4285F4"
						d="M5806.4 5192.2c0 92.1-75.4 167.5-167.5 167.5h-4727c-92.1 0-167.5-75.4-167.5-167.5V1619.1c0-92.1 75.4-167.5 167.5-167.5h4727c92.1 0 167.5 75.4 167.5 167.5v3573.1z"
					/>
					<path
						fill="#FFFFFF"
						d="M4903.8 2866H3489.4v-372.2h1414.4c41.1 0 74.4 33.3 74.4 74.4v223.3c0 41.1-33.3 74.5-74.4 74.5zM4903.8 4280.3H3489.4v-372.2h1414.4c41.1 0 74.4 33.3 74.4 74.4v223.3c0 41.2-33.3 74.5-74.4 74.5zM5127.1 3573.1H3489.4v-372.2h1637.7c41.1 0 74.4 33.3 74.4 74.4v223.3c0 41.2-33.3 74.5-74.4 74.5z"
					/>
					<path
						opacity=".2"
						fill="#1A237E"
						d="M5638.9 5322.5h-4727c-92.1 0-167.5-75.4-167.5-167.5v37.2c0 92.1 75.4 167.5 167.5 167.5h4727c92.1 0 167.5-75.4 167.5-167.5V5155c0 92.1-75.4 167.5-167.5 167.5z"
					/>
					<path
						opacity=".2"
						fill="#FFFFFF"
						d="M911.9 1488.8h4727c92.1 0 167.5 75.4 167.5 167.5v-37.2c0-92.1-75.4-167.5-167.5-167.5h-4727c-92.1 0-167.5 75.4-167.5 167.5v37.2c0-92.1 75.4-167.5 167.5-167.5z"
					/>
					<path
						fill="#FFFFFF"
						d="M2223.9 3238.2v335.7h481.7c-39.8 204.5-219.6 352.8-481.7 352.8-292.4 0-529.5-247.3-529.5-539.7s237.1-539.7 529.5-539.7c131.7 0 249.6 45.3 342.7 134v.2l254.9-254.9c-154.8-144.3-356.7-232.8-597.7-232.8-493.3 0-893.3 399.9-893.3 893.3s399.9 893.3 893.3 893.3c515.9 0 855.3-362.7 855.3-873 0-58.5-5.4-114.9-14.1-169.2h-841.1z"
					/>
					<g opacity=".2" fill="#1A237E">
						<path d="M2233.2 3573.9v37.2h472.7c3.5-12.2 6.5-24.6 9-37.2h-481.7z" />
						<path d="M2233.2 4280.3c-487.1 0-882.9-389.9-892.8-874.7-.1 6.2-.5 12.4-.5 18.6 0 493.4 399.9 893.3 893.3 893.3 515.9 0 855.3-362.7 855.3-873 0-4.1-.5-7.9-.5-12-11.1 497-347.4 847.8-854.8 847.8zM2575.9 2981.3c-93.1-88.6-211.1-134-342.7-134-292.4 0-529.5 247.3-529.5 539.7 0 6.3.7 12.4.9 18.6 9.9-284.2 242.4-521.1 528.6-521.1 131.7 0 249.6 45.3 342.7 134v.2l273.5-273.5c-6.4-6-13.5-11.3-20.1-17.1L2576 2981.5l-.1-.2z" />
					</g>
					<path
						opacity=".2"
						fill="#1A237E"
						d="M4978.2 2828.7v-37.2c0 41.1-33.3 74.4-74.4 74.4H3489.4v37.2h1414.4c41.1.1 74.4-33.2 74.4-74.4zM4903.8 4280.3H3489.4v37.2h1414.4c41.1 0 74.4-33.3 74.4-74.4v-37.2c0 41.1-33.3 74.4-74.4 74.4zM5127.1 3573.1H3489.4v37.2h1637.7c41.1 0 74.4-33.3 74.4-74.4v-37.2c0 41.1-33.3 74.4-74.4 74.4z"
					/>
					<radialGradient
						id="a"
						cx="1476.404"
						cy="434.236"
						r="6370.563"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0" stop-color="#fff" stop-opacity=".1" />
						<stop offset="1" stop-color="#fff" stop-opacity="0" />
					</radialGradient>
					<path
						fill="url(#a)"
						d="M6438.6 1408.1l-1227.7-330.2v-912c0-91.2-75.2-165.9-167.1-165.9H1507c-91.9 0-167.1 74.7-167.1 165.9v908.4L98.9 1526c-80 29.1-119.6 123.8-88 210.5l733.5 2015.4v1440.3c0 92.1 75.4 167.5 167.5 167.5h4727c92.1 0 167.5-75.4 167.5-167.5v-826.9l738.3-2755.2c23.8-89.1-23.9-180-106.1-202z"
					/>
				</svg>
				<h1 className="text-lg">Local News</h1>
			</div>
			<ul className="flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2 line-clamp-2">
				{news.slice(0, 20).map((article, index) => (
					<li key={index} className="mb-2">
						<a
							href={article.url}
							target="_blank"
							rel="noopener noreferrer"
							className=""
						>
							{article.title}
						</a>
						<p className="line-clamp-2">{article.description}</p>
					</li>
				))}
			</ul>
		</div>
	);
};

export default LocalNewsWidget;
