import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Pin, Paperclip, Megaphone, User } from "lucide-react";
import { announcements, type Announcement } from "@/data/announcements";
import { PageShell } from "@/components/page-shell";
import { fadeUp } from "@/components/motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/announcements")({
  head: () => ({
    meta: [
      { title: "Announcements — Classmate" },
      { name: "description", content: "Latest announcements and notices for AIML-B, newest first with pinned items on top." },
      { property: "og:title", content: "Announcements — Classmate" },
      { property: "og:description", content: "Latest announcements and notices for AIML-B." },
    ],
  }),
  component: AnnouncementsPage,
});

function AnnouncementsPage() {
  const sorted = [...announcements].sort((a, b) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <PageShell
      eyebrow="AIML-B"
      title="Announcements"
      description="Notices from CRs and faculty. Pinned items stay on top."
    >
      {sorted.length === 0 ? (
        <motion.div
          variants={fadeUp}
          className="grid place-items-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center"
        >
          <Megaphone className="h-8 w-8 text-muted-foreground/50" />
          <p className="font-medium">No announcements yet</p>
          <p className="text-sm text-muted-foreground">Check back soon for class updates.</p>
        </motion.div>
      ) : (
        <div className="relative space-y-4 before:absolute before:left-4 before:top-2 before:h-full before:w-px before:bg-border sm:before:left-5">
          {sorted.map((a) => (
            <TimelineItem key={a.id} item={a} />
          ))}
        </div>
      )}
    </PageShell>
  );
}

function TimelineItem({ item }: { item: Announcement }) {
  return (
    <motion.div variants={fadeUp} className="relative flex gap-4">
      <span
        className={cn(
          "z-10 mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-background sm:h-10 sm:w-10",
          item.pinned ? "bg-primary text-primary-foreground" : "bg-accent text-primary",
        )}
      >
        {item.pinned ? <Pin className="h-4 w-4" /> : <Megaphone className="h-4 w-4" />}
      </span>
      <div className="flex-1 rounded-2xl border border-border bg-card p-5 soft-shadow">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold">{item.title}</h3>
          {item.pinned && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              Pinned
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" /> {item.postedBy}
          </span>
          <span>{new Date(item.date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</span>
          {item.attachment && (
            <a
              href={item.attachment.url}
              className="flex items-center gap-1.5 text-primary hover:underline"
            >
              <Paperclip className="h-3.5 w-3.5" /> {item.attachment.name}
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
