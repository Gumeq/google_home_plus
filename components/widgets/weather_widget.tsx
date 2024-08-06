"use client";

import { fetchWeather } from "@/services/weather_service";
import React, { useEffect, useState } from "react";

const getIcon = (
	weatherDescription: string,
	theme: string,
	time_of_day: "day" | "night"
) => {
	const isDay = time_of_day === "day";
	switch (weatherDescription.toLowerCase()) {
		case "clear sky":
			return isDay
				? `/assets/weather_icons/${theme}/clear_day.svg`
				: `/assets/weather_icons/${theme}/clear_night.svg`;
		case "few clouds":
			return isDay
				? `/assets/weather_icons/${theme}/partly_cloudy_day.svg`
				: `/assets/weather_icons/${theme}/partly_cloudy_night.svg`;
		case "scattered clouds":
		case "broken clouds":
			return `/assets/weather_icons/${theme}/cloudy.svg`;
		case "shower rain":
		case "light rain":
			return isDay
				? `/assets/weather_icons/${theme}/scattered_showers_day.svg`
				: `/assets/weather_icons/${theme}/scattered_showers_night.svg`;
		case "rain":
		case "moderate rain":
		case "heavy intensity rain":
		case "very heavy rain":
		case "extreme rain":
			return `/assets/weather_icons/${theme}/showers_rain.svg`;
		case "thunderstorm":
		case "thunderstorm with light rain":
		case "thunderstorm with rain":
		case "thunderstorm with heavy rain":
		case "light thunderstorm":
		case "heavy thunderstorm":
		case "ragged thunderstorm":
		case "thunderstorm with light drizzle":
		case "thunderstorm with drizzle":
		case "thunderstorm with heavy drizzle":
			return `/assets/weather_icons/${theme}/strong_thunderstorms.svg`;
		case "snow":
		case "light snow":
		case "heavy snow":
		case "sleet":
		case "light shower sleet":
		case "shower sleet":
		case "light rain and snow":
		case "rain and snow":
		case "light shower snow":
		case "shower snow":
		case "heavy shower snow":
			return `/assets/weather_icons/${theme}/snow.svg`;
		case "mist":
		case "smoke":
		case "haze":
		case "sand/dust whirls":
		case "fog":
		case "sand":
		case "dust":
		case "volcanic ash":
		case "squalls":
		case "tornado":
			return `/assets/weather_icons/${theme}/haze_fog_dust_smoke.svg`;
		default:
			return `/assets/weather_icons/${theme}/default.svg`; // Add a default icon for unknown conditions
	}
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
			if (navigator.geolocation) {
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
					(error) => {
						setError("Failed to get location");
					}
				);
			} else {
				setError("Geolocation is not supported by this browser");
			}
		};

		getLocationAndWeather();
	}, []);

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

	const weatherDescription = weather.weather[0].description;

	// Determine if it's day or night based on the current time and sunrise/sunset times
	const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
	const sunriseTime = weather.sys.sunrise; // Sunrise time in seconds
	const sunsetTime = weather.sys.sunset; // Sunset time in seconds
	const timeOfDay = isDayTime(currentTime, sunriseTime, sunsetTime);

	const icon = getIcon(weatherDescription, "dark", timeOfDay);

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

export default WeatherWidget;
