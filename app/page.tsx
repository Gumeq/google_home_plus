import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";

export default async function Index() {
	return (
		<div>
			Public Page
			<a href="/login">login</a>
		</div>
	);
}
