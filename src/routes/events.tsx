import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CalendarClock, MapPin, Ticket, PartyPopper } from "lucide-react";
import { events, type CollegeEvent } from "@/data/events";
import { useNow } from "@/hooks/use-now";
import { useHydrated } from "@/hooks/use-hydrated";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/components/motion";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Classmate" },
      { name: "description", content: "Upcoming events, workshops and fests for AIML-B with countdowns and registration." },
      { property: "og:title", content: "Events — Classmate" },
      { property: "og:description", content: "Upcoming events, workshops and fests for AIML-B." },
    ],
  }),
  component: EventsPage,
});

function countdown(target: Date, now: Date): string {
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return "Happening now";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function EventsPage() {
  const hydrated = useHydrated();
  const now = useNow(30000);
  const upcoming = hydrated
    ? events.filter((e) => new Date(e.date).getTime() >= now.getTime())
    : events;

  return (
    <PageShell
      eyebrow="AIML-B"
      title="Upcoming events"
      description="Workshops, fests and deadlines. Past events move to archive automatically."
    >
      {upcoming.length === 0 ? (
        <motion.div
          variants={fadeUp}
          className="grid place-items-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center"
        >
          <PartyPopper className="h-8 w-8 text-muted-foreground/50" />
          <p className="font-medium">No upcoming events yet</p>
          <p className="text-sm text-muted-foreground">New events will appear here as they're posted.</p>
        </motion.div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((e) => (
            <EventCard key={e.id} event={e} now={now} />
          ))}
        </div>
      )}
    </PageShell>
  );
}

function EventCard({ event, now }: { event: CollegeEvent; now: Date }) {
  const date = new Date(event.date);
  return (
    <motion.div
      variants={fadeUp}
      className="hover-lift flex flex-col overflow-hidden rounded-2xl border border-border bg-card soft-shadow"
    >
      <div className="relative aspect-video bg-accent">
        {event.poster ? (
          <img src={event.poster} alt={event.title} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-muted-foreground/40">
            <CalendarClock className="h-10 w-10" />
          </div>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
          {countdown(date, now)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-snug">{event.title}</h3>
        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 shrink-0" />
            {date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })} ·{" "}
            {date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            {event.venue}
          </div>
        </div>
        <Button asChild className="mt-5 rounded-xl" disabled={!event.registerUrl}>
          <a href={event.registerUrl ?? "#"} target="_blank" rel="noreferrer">
            <Ticket className="h-4 w-4" /> Register
          </a>
        </Button>
      </div>
    </motion.div>
  );
}
