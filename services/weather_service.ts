const API_KEY = process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY!; // Replace with your OpenWeatherMap API key

export const fetchWeather = async (lat: number, lon: number) => {
	const response = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
	);

	if (!response.ok) {
		throw new Error("Failed to fetch weather data");
	}

	const data = await response.json();
	return data;
};
