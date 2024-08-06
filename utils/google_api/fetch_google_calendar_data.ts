import { createClient } from "../supabase/client";

interface CalendarEvent {
	id: string;
	summary: string;
	start: { dateTime: string };
}

const fetchCalendarEvents = async (
	accessToken: any,
	maxResults: number
): Promise<CalendarEvent[] | null> => {
	const now = new Date().toISOString();

	try {
		const response = await fetch(
			`https://www.googleapis.com/calendar/v3/calendars/primary/events?orderBy=startTime&singleEvents=true&timeMin=${now}&maxResults=${maxResults}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const eventsData = await response.json();

		if (!eventsData.items) {
			throw new Error("No events found in the response");
		}

		return eventsData.items as CalendarEvent[];
	} catch (apiError) {
		console.error("Error fetching calendar events:", apiError);
		return null;
	}
};

export default fetchCalendarEvents;
