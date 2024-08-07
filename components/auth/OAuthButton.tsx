"use client";
import { oAuthSignIn } from "@/app/login/actions";
import { Provider } from "@supabase/supabase-js";

type OAuthProvider = {
	name: Provider;
	displayName: string;
	icon: string;
};

export function OAuthButton() {
	const oAuthProviders: OAuthProvider[] = [
		{
			name: "google",
			displayName: "Google",
			icon: "/assets/icons/google_icon.svg",
		},
	];

	return (
		<>
			{oAuthProviders.map((provider) => (
				<button
					className="flex items-center justify-center gap-4 outline outline-1 outline-foreground/20 outline-solid rounded-md px-4 py-2 text-foreground mb-2 drop-shadow-md"
					onClick={async () => {
						await oAuthSignIn(provider.name);
					}}
					type={"button"}
				>
					{provider.icon && (
						<img
							src={provider.icon}
							alt={""}
							width={15}
							height={15}
							className="invert-on-dark"
						></img>
					)}

					<p>Login with {provider.displayName}</p>
				</button>
			))}
		</>
	);
}
