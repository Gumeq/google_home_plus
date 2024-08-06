import fetchLatestSubscriptionVideo from "@/utils/google_api/fetch_youtube_videos";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const accessToken = searchParams.get("accessToken");
	const maxResults = searchParams.get("maxResults");

	if (!accessToken || !maxResults) {
		return NextResponse.json(
			{ error: "Access token and max results are required" },
			{ status: 400 }
		);
	}

	const videos = await fetchLatestSubscriptionVideo(
		accessToken,
		parseInt(maxResults, 10)
	);

	if (!videos) {
		return NextResponse.json(
			{ error: "Failed to fetch videos" },
			{ status: 500 }
		);
	}

	return NextResponse.json({ videos });
}
