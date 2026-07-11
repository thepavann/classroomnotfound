export interface Announcement {
  id: number;
  title: string;
  description: string;
  postedBy: string;
  date: string; // ISO
  pinned?: boolean;
  attachment?: { name: string; url: string };
}

// Paste announcement data here later.
export const announcements: Announcement[] = [];
