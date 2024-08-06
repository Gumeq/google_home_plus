// app/auth/callback/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get("code");
	const origin = requestUrl.origin;

	if (code) {
		const supabase = createClient();
		const { data, error } = await supabase.auth.exchangeCodeForSession(
			code
		);

		if (error) {
			console.error("Error exchanging code for session:", error);
			return NextResponse.redirect(
				`${origin}/login?message=Authentication failed`
			);
		}

		const { session } = data;
		const providerToken = session?.provider_token;
		const refreshToken = session?.provider_refresh_token;
		console.log("Session:", session);

		if (providerToken && refreshToken) {
			// Store tokens securely in Supabase database

			const { error: userError } = await supabase
				.from("user_tokens")
				.select("user_id")
				.eq("user_id", session.user.id);
			if (!userError) {
				const { error: dbError } = await supabase
					.from("user_tokens")
					.update({
						provider_token: providerToken,
						refresh_token: refreshToken,
						expiry_date: session.expires_at,
					})
					.eq("user_id", session.user.id);
				if (dbError) {
					console.error("Error saving tokens to database:", dbError);
					return NextResponse.redirect(
						`${origin}/login?message=Failed to save tokens`
					);
				}
			} else {
				const { error: dbError } = await supabase
					.from("user_tokens")
					.insert({
						user_id: session.user.id,
						provider_token: providerToken,
						refresh_token: refreshToken,
						expiry_date: session.expires_at,
					});
				if (dbError) {
					console.error("Error saving tokens to database:", dbError);
					return NextResponse.redirect(
						`${origin}/login?message=Failed to save tokens`
					);
				}
			}
		} else {
			return NextResponse.redirect(
				`${origin}/login?message=Could not retrieve tokens`
			);
		}

		return NextResponse.redirect(`${origin}/protected`);
	}

	return NextResponse.redirect(`${origin}/login?message=No code provided`);
}
