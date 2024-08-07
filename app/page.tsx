import { OAuthButton } from "@/components/auth/OAuthButton";
import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Index() {
	const supabase = createClient();
	const { data: user } = await supabase.auth.getUser();
	if (user) {
		redirect("/protected");
	}
	return (
		<div className=" max-w-7xl w-screen h-screen flex flex-col">
			<h1 className="text-4xl my-16 w-full text-center">
				Welcome to Google Home +
			</h1>
			<div className="w-full flex items-center justify-center mb-16">
				<OAuthButton></OAuthButton>
			</div>
			<div className="w-full bg-red-500">
				<img
					src="/assets/images/landing_display.png"
					alt=""
					className="drop-shadow-lg"
				/>
			</div>
		</div>
	);
}
