import { google } from "googleapis";

interface SmartDevice {
	id: string;
	type: string;
	name: string;
	room: string;
	traits: string[];
}

const fetchSmartDevices = async (accessToken: string): Promise<any> => {
	try {
		const auth = new google.auth.OAuth2();
		auth.setCredentials({ access_token: accessToken });

		const homegraph = google.homegraph({ version: "v1", auth });

		const response = await homegraph.devices.query({
			requestBody: {
				agentUserId: "your_agent_user_id", // Replace with your actual agent user ID
			},
		});

		return response;
	} catch (error: any) {
		console.error("Error fetching smart devices:", error);
		if (error.response) {
			console.error("API Response Error:", error.response.data);
		}
		return null;
	}
};

export default fetchSmartDevices;
