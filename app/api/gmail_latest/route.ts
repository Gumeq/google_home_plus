import fetchLatestEmails from "@/utils/google_api/fetch_gmail_latest";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const accessToken = searchParams.get("accessToken");
	const maxResults = searchParams.get("maxResults");

	if (!accessToken || !maxResults) {
		console.error("Access token or max results not provided.");
		return NextResponse.json(
			{ error: "Access token and max results are required" },
			{ status: 400 }
		);
	}

	try {
		const emails = await fetchLatestEmails(
			accessToken,
			parseInt(maxResults, 10)
		);

		if (!emails) {
			console.error("Failed to fetch emails.");
			return NextResponse.json(
				{ error: "Failed to fetch emails" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ emails });
	} catch (error) {
		console.error("Error in GET /api/gmail_latest:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
