export const fetchGeolocation = async () => {
	const response = await fetch(`http://ip-api.com/json/`);
	if (!response.ok) {
		throw new Error("Failed to fetch geolocation data");
	}
	const data = await response.json();
	return data;
};
