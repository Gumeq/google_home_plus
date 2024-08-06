const api_key = process.env.NEXT_PUBLIC_NEWS_API_KEY;

export const fetchNews = async (countryCode: string) => {
	const response = await fetch(
		`https://newsapi.org/v2/top-headlines?country=${countryCode}&category=technology&apiKey=${api_key}`
	);
	if (!response.ok) {
		throw new Error("Failed to fetch news");
	}
	const data = await response.json();
	return data.articles;
};
