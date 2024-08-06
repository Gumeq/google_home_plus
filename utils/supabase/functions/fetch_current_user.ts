import { createClient } from "../server";

export async function getCurrentUser(): Promise<any | null> {
	try {
		const supabase = createClient();
		const {
			data: { user: supabaseUser },
		} = await supabase.auth.getUser();
		if (supabaseUser) {
			return supabaseUser;
		}
		return null;
	} catch (error) {
		return error;
	}
}
