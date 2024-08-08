import { google } from "googleapis";

interface Email {
	id: string;
	snippet: string;
	internalDate: string;
	subject: string;
	from: string;
	isUnread: boolean;
}

const fetchLatestEmails = async (
	accessToken: string,
	maxResults: number
): Promise<Email[] | null> => {
	try {
		const auth = new google.auth.OAuth2();
		auth.setCredentials({ access_token: accessToken });

		const gmail = google.gmail({ version: "v1", auth });

		const response = await gmail.users.messages.list({
			userId: "me",
			maxResults,
			// q: "is:unread", // Optional: filter for unread emails
		});

		if (!response.data.messages || response.data.messages.length === 0) {
			console.error("No emails found.");
			return [];
		}

		const emailPromises = response.data.messages.map(async (message) => {
			const msg = await gmail.users.messages.get({
				userId: "me",
				id: message.id!,
				format: "metadata",
				metadataHeaders: ["Subject", "From"],
			});

			const headers = msg.data.payload?.headers || [];
			const subjectHeader = headers.find(
				(header) => header.name === "Subject"
			);
			const fromHeader = headers.find((header) => header.name === "From");

			return {
				id: message.id!,
				snippet: msg.data.snippet || "",
				internalDate: msg.data.internalDate || "",
				subject: subjectHeader?.value || "No subject",
				from: fromHeader?.value || "Unknown sender",
				isUnread: msg.data.labelIds?.includes("UNREAD") || false,
			};
		});

		const emails: Email[] = await Promise.all(emailPromises);

		return emails;
	} catch (error: any) {
		console.error("Error fetching latest emails:", error);
		if (error.response) {
			console.error("API Response Error:", error.response.data);
		}
		return null;
	}
};

export default fetchLatestEmails;
