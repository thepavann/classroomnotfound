export interface CollegeEvent {
  id: number;
  title: string;
  date: string; // ISO
  venue: string;
  poster: string;
  registerUrl?: string;
}

// Paste event data here later.
export const events: CollegeEvent[] = [];
