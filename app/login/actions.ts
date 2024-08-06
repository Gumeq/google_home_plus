"use server";

// app/auth/signin.ts
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function oAuthSignIn(provider: any) {
	if (!provider) {
		return redirect("/login?message=No provider selected");
	}

	const supabase = createClient();
	const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider,
		options: {
			redirectTo: redirectUrl,
			queryParams: {
				access_type: "offline",
				prompt: "consent",
				scope: "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/gmail.readonly",
			},
		},
	});

	if (error) {
		return redirect("/login?message=Could not authenticate");
	}

	return redirect(data.url);
}
