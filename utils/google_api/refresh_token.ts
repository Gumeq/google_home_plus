// lib/authUtils.ts

import { createClient } from "../supabase/server";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

interface RefreshTokenResponse {
	access_token: string;
	expires_in: number;
}

export const refreshAccessToken = async (
	refreshToken: string,
	userId: string,
	expires_at: number
): Promise<RefreshTokenResponse | null> => {
	console.log(userId);
	try {
		// Check if the token is expired
		const currentTime = Math.floor(Date.now() / 1000);
		if (currentTime < expires_at) {
			console.log("Access token is still valid.");
			return null; // Token is still valid, no need to refresh
		}

		const params = new URLSearchParams({
			client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
			client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
			refresh_token: refreshToken,
			grant_type: "refresh_token",
		});

		console.log("Params being sent:", params.toString()); // Debugging line

		const response = await fetch(GOOGLE_TOKEN_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: params.toString(),
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error("Error response data:", errorData); // Debugging line
			throw new Error(
				`Failed to refresh access token: ${response.statusText}`
			);
		}

		const data: RefreshTokenResponse = await response.json();

		const supabase = createClient();

		// Save the new access token and expiration time to the database
		const { error } = await supabase
			.from("user_tokens")
			.update({
				provider_token: data.access_token,
				expiry_date: currentTime + data.expires_in, // Update the expiration time
				updated_at: new Date(),
			})
			.eq("user_id", userId);

		if (error) {
			console.error("Error saving access token to database:", error);
			throw new Error("Failed to save access token to database");
		}

		return data;
	} catch (error) {
		console.error("Error refreshing access token:", error);
		throw new Error("Failed to refresh access token");
	}
};
