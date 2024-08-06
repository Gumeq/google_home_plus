import { google } from "googleapis";

interface Video {
	title: string;
	videoId: string;
	publishedAt: string;
}

const fetchLatestSubscriptionVideo = async (
	accessToken: string,
	maxResults: number
): Promise<Video[] | null> => {
	try {
		const auth = new google.auth.OAuth2();
		auth.setCredentials({ access_token: accessToken });

		const youtube = google.youtube({ version: "v3", auth });

		// Fetch subscriptions
		const subscriptionsResponse = await youtube.subscriptions.list({
			part: ["snippet"],
			mine: true,
			maxResults: 50,
		});

		if (!subscriptionsResponse.data.items) {
			console.error("No subscriptions found.");
			return null;
		}

		const subscriptions = subscriptionsResponse.data.items
			.map((item) => item.snippet?.resourceId?.channelId)
			.filter((channelId) => channelId !== undefined) as string[];

		const videoPromises = subscriptions.map(async (channelId) => {
			const videosResponse = await youtube.search.list({
				part: ["snippet"],
				channelId: channelId,
				order: "date",
				maxResults: 1, // Get the latest video from each channel
			});

			return (
				videosResponse.data.items?.map((video) => ({
					title: video.snippet?.title || "",
					videoId: video.id?.videoId || "",
					publishedAt: video.snippet?.publishedAt || "",
				})) || []
			);
		});

		const videos = (await Promise.all(videoPromises))
			.flat()
			.slice(0, maxResults);

		return videos;
	} catch (error) {
		console.error("Error fetching latest subscription videos:", error);
		return null;
	}
};

export default fetchLatestSubscriptionVideo;
