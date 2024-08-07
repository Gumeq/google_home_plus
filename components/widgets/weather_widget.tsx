"use client";

import { fetchWeather } from "@/services/weather_service";
import React, { useEffect, useState, useMemo } from "react";

const weatherIcons = {
	clear: { day: "clear_day.svg", night: "clear_night.svg" },
	clouds: {
		few: { day: "partly_cloudy_day.svg", night: "partly_cloudy_night.svg" },
		scattered: "cloudy.svg",
		broken: "cloudy.svg",
	},
	rain: {
		shower: {
			day: "scattered_showers_day.svg",
			night: "scattered_showers_night.svg",
		},
		default: "showers_rain.svg",
	},
	thunderstorm: "strong_thunderstorms.svg",
	snow: "snow.svg",
	mist: "haze_fog_dust_smoke.svg",
	haze: "haze_fog_dust_smoke.svg",
	fog: "haze_fog_dust_smoke.svg",
	smoke: "haze_fog_dust_smoke.svg",
	dust: "haze_fog_dust_smoke.svg",
	default: "default.svg",
};

const getIcon = (
	weatherDescription: string,
	theme: string,
	timeOfDay: "day" | "night"
) => {
	const lowerDescription = weatherDescription.toLowerCase();
	if (lowerDescription.includes("clear")) {
		return `/assets/weather_icons/${theme}/${weatherIcons.clear[timeOfDay]}`;
	} else if (lowerDescription.includes("few clouds")) {
		return `/assets/weather_icons/${theme}/${weatherIcons.clouds.few[timeOfDay]}`;
	} else if (lowerDescription.includes("clouds")) {
		return `/assets/weather_icons/${theme}/${weatherIcons.clouds.scattered}`;
	} else if (lowerDescription.includes("rain")) {
		if (lowerDescription.includes("shower")) {
			return `/assets/weather_icons/${theme}/${weatherIcons.rain.shower[timeOfDay]}`;
		}
		return `/assets/weather_icons/${theme}/${weatherIcons.rain.default}`;
	} else if (lowerDescription.includes("thunderstorm")) {
		return `/assets/weather_icons/${theme}/${weatherIcons.thunderstorm}`;
	} else if (lowerDescription.includes("snow")) {
		return `/assets/weather_icons/${theme}/${weatherIcons.snow}`;
	} else if (
		lowerDescription.includes("mist") ||
		lowerDescription.includes("haze") ||
		lowerDescription.includes("fog") ||
		lowerDescription.includes("smoke") ||
		lowerDescription.includes("dust")
	) {
		return `/assets/weather_icons/${theme}/${weatherIcons.mist}`;
	}
	return `/assets/weather_icons/${theme}/${weatherIcons.default}`;
};

const isDayTime = (
	currentTime: number,
	sunriseTime: number,
	sunsetTime: number
): "day" | "night" => {
	return currentTime >= sunriseTime && currentTime < sunsetTime
		? "day"
		: "night";
};

const WeatherWidget: React.FC = () => {
	const [weather, setWeather] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const getLocationAndWeather = async () => {
			if (!navigator.geolocation) {
				setError("Geolocation is not supported by this browser");
				return;
			}

			navigator.geolocation.getCurrentPosition(
				async (position) => {
					try {
						const { latitude, longitude } = position.coords;
						const weatherData = await fetchWeather(
							latitude,
							longitude
						);
						setWeather(weatherData);
					} catch (error) {
						setError("Failed to fetch weather data");
					}
				},
				() => {
					setError("Failed to get location");
				}
			);
		};

		getLocationAndWeather();
	}, []);

	const weatherDescription = weather?.weather[0].description || "";
	const currentTime = useMemo(() => Math.floor(Date.now() / 1000), []);
	const sunriseTime = weather?.sys.sunrise || 0;
	const sunsetTime = weather?.sys.sunset || 0;
	const timeOfDay = useMemo(
		() => isDayTime(currentTime, sunriseTime, sunsetTime),
		[currentTime, sunriseTime, sunsetTime]
	);
	const icon = useMemo(
		() => getIcon(weatherDescription, "dark", timeOfDay),
		[weatherDescription, timeOfDay]
	);

	if (error) {
		return (
			<div className="w-full h-full flex items-center justify-center text-black bg-red-200">
				{error}
			</div>
		);
	}

	if (!weather) {
		return (
			<div className="w-full h-full flex items-center justify-center text-foreground">
				Loading...
			</div>
		);
	}

	return (
		<div className="w-full h-full flex flex-col items-center justify-center text-foreground relative">
			<div className="flex flex-row h-1/2 items-center gap-2">
				<img
					src={icon}
					alt={weatherDescription}
					className="h-full m-2 p-2"
				/>
				<p className="text-4xl font-bold">
					{Math.round(weather.main.temp)}°C
				</p>
			</div>
			<div className="flex flex-col items-center justify-center">
				<div className="flex flex-row gap-1 items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 -960 960 960"
						width="24px"
						fill="#e8eaed"
					>
						<path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 400Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Z" />
					</svg>
					<h3 className="text-xl">{weather.name}</h3>
				</div>

				<p className="text-xl font-bold">
					{weather.weather[0].description}
				</p>
			</div>
		</div>
	);
};

export default React.memo(WeatherWidget);
