import { createClient } from "../client";

export interface Query {
	id: string;
	created_at: string;
	user_id: string;
	query: string;
}

export async function fetchLatestQueries(
	user_id: string,
	search_query: string
): Promise<Query[]> {
	const supabase = createClient();
	const { data, error } = await supabase.rpc("get_latest_queries", {
		p_user_id: user_id,
		p_query: search_query,
	});

	if (error) {
		console.error("Error fetching latest queries:", error);
		return [];
	}

	return data as Query[];
}

export async function addQuery(user_id: string, search_query: string) {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("queries")
		.insert([{ user_id: user_id, query: search_query }])
		.select();

	if (error) {
		console.error("Error adding to queries", error);
	} else {
		console.log("added query:", search_query);
	}
}
